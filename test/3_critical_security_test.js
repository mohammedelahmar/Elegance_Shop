#!/usr/bin/env node
import 'dotenv/config';
import assert from 'node:assert/strict';
import axios from 'axios';
import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const config = buildConfig();

async function run() {
	let driver;
	try {
		driver = await createDriver();

		console.log('👤 Connexion utilisateur standard en cours...');
		const token = await loginAsStandardUser(driver);

		console.log('🔍 Vérification du rôle utilisateur...');
		const userRole = await ensureUserIsNotAdmin(token);

		console.log('🧱 Tentative d’accès API admin avec un compte client...');
		await expectAdminApiForbidden(token);

		console.log('🚫 Tentative de navigation vers les routes /admin/* via l’UI...');
		await assertAdminRouteRedirect(driver);

		console.log('✅ Test critique RBAC réussi :', {
			utilisateur: config.credentials.email,
			roleDetecte: userRole,
			routeProtegee: config.adminUiPath,
			redirectionsAutorisees: config.allowedRedirectPaths
		});
	} catch (error) {
		console.error('❌ Échec du test critique de sécurité (RBAC):', error);
		process.exitCode = 1;
	} finally {
		if (driver) {
			if (config.keepBrowserOpen) {
				console.log('🎬 Mode démonstration : le navigateur reste ouvert. Fermez-le manuellement (Ctrl+C pour arrêter).');
				await holdBrowserOpen();
			} else {
				await driver.quit();
			}
		}
	}
}

function buildConfig() {
	const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:3000';
	const apiBaseUrl = process.env.E2E_API_BASE_URL || 'http://localhost:5000/api';
	const email = process.env.E2E_USER_EMAIL;
	const password = process.env.E2E_USER_PASSWORD;
	const waitTimeout = Number.parseInt(process.env.E2E_WAIT_TIMEOUT ?? '20000', 10);
	const networkTimeout = Number.parseInt(process.env.E2E_API_TIMEOUT ?? '15000', 10);
	const headless = (process.env.E2E_HEADLESS ?? 'true').toLowerCase() !== 'false';
	const demoDelay = Number.parseInt(process.env.E2E_DEMO_DELAY ?? '800', 10);
	const keepBrowserOpen = (process.env.E2E_KEEP_BROWSER_OPEN ?? 'true').toLowerCase() !== 'false';
	const adminUiPathRaw = process.env.E2E_ADMIN_RBAC_PATH || '/admin/dashboard';
	const adminUiPath = adminUiPathRaw.startsWith('/') ? adminUiPathRaw : `/${adminUiPathRaw}`;
	const adminApiProbe = process.env.E2E_ADMIN_API_PROBE || '/users';
	const allowedRedirectPaths = parseList(process.env.E2E_RBAC_ALLOWED_REDIRECTS, ['/', '/login', '/home']).map(normalizePath);
	const accessDeniedSelectors = parseList(
		process.env.E2E_RBAC_FEEDBACK_SELECTORS,
		['.toast', '.Toastify__toast', '.alert', '.chakra-alert', '[role="alert"]']
	);
	const accessDeniedKeywords = parseList(
		process.env.E2E_RBAC_FEEDBACK_KEYWORDS,
		['Access denied', 'Accès refusé', 'Unauthorized', 'Not authorized']
	);

	const missing = [];
	if (!email) missing.push('E2E_USER_EMAIL');
	if (!password) missing.push('E2E_USER_PASSWORD');
	if (missing.length) {
		throw new Error(`Variables d’environnement manquantes: ${missing.join(', ')}`);
	}

	return {
		baseUrl,
		apiBaseUrl,
		credentials: { email, password },
		waitTimeout,
		networkTimeout,
		headless,
		demoDelay,
		keepBrowserOpen,
		adminUiPath,
		adminApiProbe,
		allowedRedirectPaths,
		accessDeniedSelectors,
		accessDeniedKeywords
	};
}

async function createDriver() {
	const chromeOptions = new chrome.Options().addArguments(
		'--disable-gpu',
		'--window-size=1920,1080',
		'--no-sandbox',
		'--disable-dev-shm-usage'
	);

	if (config.headless) {
		chromeOptions.addArguments('--headless=new');
	}

	return new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
}

async function loginAsStandardUser(driver) {
	await driver.get(`${config.baseUrl}/login`);
	await demoPause();

	const emailInput = await waitForElement(driver, By.css('input[type="email"], input[name="email"]'));
	await typeSlow(emailInput, 'wrong-email.com');
	await demoPause();

	const passwordInput = await waitForElement(driver, By.css('input[type="password"], input[name="password"]'));
	const wrongPassword = `${config.credentials.password || 'password'}_wrong`;
	await typeSlow(passwordInput, wrongPassword);
	await demoPause();

	const submitButton = await waitForElement(driver, By.css('button[type="submit"]'));
	await submitButton.click();
	await demoPause();

	await observeAndFixInvalidEmail(driver, emailInput, submitButton);
	await observeAndFixInvalidPassword(driver, passwordInput, submitButton);
	await demoPause();

	await driver.wait(async () => {
		const token = await driver.executeScript('return window.localStorage.getItem("userToken");');
		return Boolean(token);
	}, config.waitTimeout, 'Le token utilisateur n’a pas été enregistré après la connexion.');

	const token = await driver.executeScript('return window.localStorage.getItem("userToken");');
	assert.ok(token, 'Aucun token utilisateur présent dans le localStorage après la connexion.');
	return token;
}

async function ensureUserIsNotAdmin(token) {
	const client = buildApiClient(token);
	const { data } = await client.get('/users/profile');
	const role = (data?.role || data?.user?.role || '').toLowerCase();
	assert.ok(role, 'Impossible de déterminer le rôle utilisateur à partir du profil.');
	assert.notStrictEqual(role, 'admin', 'Les identifiants fournis correspondent à un administrateur; impossible de valider la protection RBAC.');
	return role;
}

async function expectAdminApiForbidden(token) {
	const client = buildApiClient(token);
	try {
		await client.get(config.adminApiProbe);
		throw new Error(`La route ${config.adminApiProbe} a autorisé un utilisateur non administrateur.`);
	} catch (error) {
		const status = error.response?.status;
		assert.strictEqual(
			status,
			403,
			`La route ${config.adminApiProbe} a répondu avec le statut ${status ?? 'inconnu'} au lieu de 403.`
		);
		console.log('🛡️ La couche API refuse correctement les accès admin (403).');
	}
}

async function assertAdminRouteRedirect(driver) {
	const adminUrl = new URL(config.adminUiPath, ensureTrailingSlash(config.baseUrl)).toString();
	await driver.get(adminUrl);
	await demoPause();

	await driver.wait(async () => {
		const currentUrl = await driver.getCurrentUrl();
		const pathname = normalizePath(new URL(currentUrl).pathname);
		return !pathname.startsWith('/admin');
	}, config.waitTimeout, 'L’utilisateur est resté bloqué sur une route /admin au lieu d’être redirigé.');

	const redirectedUrl = await driver.getCurrentUrl();
	const redirectedPath = normalizePath(new URL(redirectedUrl).pathname);
	assert.ok(
		config.allowedRedirectPaths.includes(redirectedPath),
		`Redirection inattendue détectée (${redirectedUrl}). Chemins autorisés: ${config.allowedRedirectPaths.join(', ')}`
	);

	const messageFound = await detectAccessDeniedFeedback(driver);
	if (messageFound) {
		console.log('📢 Message visuel d’accès refusé détecté.');
	} else {
		console.warn('⚠️ Aucun message visuel explicite détecté, mais la redirection est effective.');
	}
}

async function detectAccessDeniedFeedback(driver) {
	const keywords = config.accessDeniedKeywords;
	if (!keywords.length) {
		return false;
	}
	await demoPause();

	for (const selector of config.accessDeniedSelectors) {
		if (!selector) continue;
		const elements = await driver.findElements(By.css(selector));
		for (const element of elements) {
			const text = (await element.getText())?.trim();
			if (containsKeyword(text, keywords)) {
				return true;
			}
		}
	}

	const bodyText = await driver.executeScript('return document.body ? document.body.innerText : "";');
	return containsKeyword(bodyText, keywords);
}

function containsKeyword(text, keywords) {
	if (!text) return false;
	const lower = text.toLowerCase();
	return keywords.some((keyword) => keyword && lower.includes(keyword.toLowerCase()));
}

function buildApiClient(token) {
	return axios.create({
		baseURL: config.apiBaseUrl,
		timeout: config.networkTimeout,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	});
}

async function waitForElement(driver, locator) {
	const element = await driver.wait(until.elementLocated(locator), config.waitTimeout);
	await driver.wait(until.elementIsVisible(element), config.waitTimeout);
	await driver.wait(until.elementIsEnabled(element), config.waitTimeout);
	return element;
}

async function fillInput(element, value) {
	const modifier = process.platform === 'darwin' ? Key.COMMAND : Key.CONTROL;
	await element.click();
	await element.sendKeys(Key.chord(modifier, 'a'));
	await element.sendKeys(Key.BACK_SPACE);
	await element.sendKeys(value);
}

async function typeSlow(element, value) {
	for (const char of value.toString()) {
		await element.sendKeys(char);
		await delay(80);
	}
	await demoPause();
}

function parseList(rawValue, fallback) {
	if (!rawValue) return fallback;
	const items = rawValue
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
	return items.length ? items : fallback;
}

function normalizePath(pathname) {
	if (!pathname || pathname === '/') {
		return '/';
	}
	let normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
	if (normalized.length > 1 && normalized.endsWith('/')) {
		normalized = normalized.slice(0, -1);
	}
	return normalized;
}

function ensureTrailingSlash(url) {
	return url.endsWith('/') ? url : `${url}/`;
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function observeAndFixInvalidEmail(driver, emailInput, submitButton) {
	console.log('🚧 Démonstration : email invalide, observation du message d’erreur...');
	const feedbackWait = Math.max(4000, config.demoDelay * 2);
	try {
		await driver.wait(async () => {
			const validationMessage = await driver.executeScript('return arguments[0].validationMessage;', emailInput);
			if (validationMessage) return true;
			const alerts = await driver.findElements(By.css('.alert-danger, .invalid-feedback, .error, .text-danger'));
			return alerts.length > 0;
		}, feedbackWait);
		await demoPause();
	} catch (error) {
		console.warn('Aucun message d’erreur détecté après l’email invalide (poursuite du scénario).');
	}

	console.log('✏️ Correction automatique de l’email, puis nouvelle tentative...');
	await fillInput(emailInput, config.credentials.email);
	await demoPause();
	await submitButton.click();
}

async function observeAndFixInvalidPassword(driver, passwordInput, submitButton) {
	console.log('🔐 Démonstration : mot de passe erroné, observation du message d’erreur...');
	const feedbackWait = Math.max(4000, config.demoDelay * 2);
	try {
		await driver.wait(async () => {
			const alerts = await driver.findElements(By.css('.alert-danger, .invalid-feedback, .error, .text-danger'));
			return alerts.length > 0;
		}, feedbackWait);
		await demoPause();
	} catch (error) {
		console.warn('Aucun message d’erreur détecté après le mauvais mot de passe (poursuite du scénario).');
	}

	console.log('✏️ Correction automatique du mot de passe, nouvelle tentative de connexion...');
	await fillInput(passwordInput, config.credentials.password);
	await demoPause();
	await submitButton.click();
}

async function holdBrowserOpen() {
	return new Promise(() => {});
}

async function demoPause(multiplier = 1) {
	if (!config.demoDelay || config.demoDelay <= 0) return;
	await delay(config.demoDelay * multiplier);
}

run();
