#!/usr/bin/env node
import 'dotenv/config';
import axios from 'axios';
import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const config = buildConfig();

async function run() {
	let driver;
	const chromeOptions = new chrome.Options()
		.addArguments('--disable-gpu', '--window-size=1920,1080', '--no-sandbox', '--disable-dev-shm-usage');

	if (config.headless) {
		chromeOptions.addArguments('--headless=new');
	}

	const productUnderTest = buildProductCandidate();

	try {
		driver = await new Builder()
			.forBrowser('chrome')
			.setChromeOptions(chromeOptions)
			.build();

		console.log('🔐 Connexion administrateur en cours...');
		const adminToken = await loginAsAdmin(driver);

		console.log('🧭 Accès au panneau des produits...');
		await driver.get(`${config.baseUrl}/admin/products`);
		await demoPause();
		await waitForAdminProductsPage(driver);

		console.log('➕ Création d’un nouveau produit via le formulaire admin...');
		await createProductViaUi(driver, productUnderTest);

		console.log('📋 Vérification de la présence du produit dans la table administrateur...');
		await assertProductVisibleInAdminList(driver, productUnderTest.name);

		console.log('🌐 Vérification de la disponibilité dans la liste publique...');
		await assertProductVisibleInPublicListing(driver, productUnderTest.name);

		if (config.enableCleanup) {
			console.log('🧹 Nettoyage: suppression du produit de test via l’API...');
			await deleteProductViaApi(adminToken, productUnderTest.name);
		}

		console.log('✅ Test critique admin réussi :', {
			produit: productUnderTest.name,
			prix: productUnderTest.price,
			stock: productUnderTest.stock_quantity
		});
	} catch (error) {
		console.error('❌ Échec du test critique admin:', error);
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
	const adminEmail = process.env.E2E_ADMIN_EMAIL;
	const adminPassword = process.env.E2E_ADMIN_PASSWORD;
	const waitTimeout = Number.parseInt(process.env.E2E_WAIT_TIMEOUT ?? '20000', 10);
	const networkTimeout = Number.parseInt(process.env.E2E_API_TIMEOUT ?? '15000', 10);
	const headless = (process.env.E2E_HEADLESS ?? 'true').toLowerCase() !== 'false';
	const demoDelay = Number.parseInt(process.env.E2E_DEMO_DELAY ?? '800', 10);
	const keepBrowserOpen = (process.env.E2E_KEEP_BROWSER_OPEN ?? 'true').toLowerCase() !== 'false';
	const productPrice = Number.parseFloat(process.env.E2E_ADMIN_PRODUCT_PRICE ?? '79.99');
	const productStock = Number.parseInt(process.env.E2E_ADMIN_PRODUCT_STOCK ?? '15', 10);
	const productImage = process.env.E2E_ADMIN_PRODUCT_IMAGE || 'https://via.placeholder.com/600x600?text=E2E+ADMIN';
	const productDescription = process.env.E2E_ADMIN_PRODUCT_DESCRIPTION || 'Produit créé automatiquement pour le test critique admin.';
	const productPrefix = process.env.E2E_ADMIN_PRODUCT_PREFIX || 'ADMIN-AUTO';
	const categoryKeyword = process.env.E2E_ADMIN_CATEGORY_KEYWORD || '';
	const enableCleanup = (process.env.E2E_ADMIN_CLEANUP ?? 'true').toLowerCase() !== 'false';

	const missing = [];
	if (!adminEmail) missing.push('E2E_ADMIN_EMAIL');
	if (!adminPassword) missing.push('E2E_ADMIN_PASSWORD');
	if (missing.length) {
		throw new Error(`Variables d’environnement manquantes: ${missing.join(', ')}`);
	}

	if (!Number.isFinite(productPrice) || productPrice <= 0) {
		throw new Error('E2E_ADMIN_PRODUCT_PRICE doit être un nombre positif.');
	}

	if (!Number.isInteger(productStock) || productStock < 0) {
		throw new Error('E2E_ADMIN_PRODUCT_STOCK doit être un entier supérieur ou égal à 0.');
	}

	return {
		baseUrl,
		apiBaseUrl,
		credentials: { email: adminEmail, password: adminPassword },
		waitTimeout,
		networkTimeout,
		headless,
		demoDelay,
		keepBrowserOpen,
		productTemplate: {
			price: productPrice,
			stock_quantity: productStock,
			image_url: productImage,
			description: productDescription,
			prefix: productPrefix
		},
		categoryKeyword: categoryKeyword.toLowerCase().trim(),
		enableCleanup
	};
}

function buildProductCandidate() {
	const uniqueSuffix = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
	return {
		name: `${config.productTemplate.prefix}-${uniqueSuffix}`,
		description: config.productTemplate.description,
		price: config.productTemplate.price,
		stock_quantity: config.productTemplate.stock_quantity,
		image_url: config.productTemplate.image_url
	};
}

async function loginAsAdmin(driver) {
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
	}, config.waitTimeout, 'Le token administrateur n’a pas été stocké après la connexion.');

	return driver.executeScript('return window.localStorage.getItem("userToken");');
}

async function waitForAdminProductsPage(driver) {
	await driver.wait(until.urlContains('/admin/products'), config.waitTimeout);
	await waitForElement(driver, By.css('.products-admin-actions, .admin-page-container'));
	await waitForElement(driver, By.css('table.category-table, table'));
}

async function createProductViaUi(driver, product) {
	const addButton = await waitForElement(driver, By.xpath("//button[contains(., 'Add Product') or contains(., 'Add new product') or contains(., 'Ajouter')]"));
	await scrollIntoView(driver, addButton);
	await addButton.click();
	await demoPause();

	await waitForElement(driver, By.css('.product-modal.show, .modal.show'));

	await typeSlow(await waitForElement(driver, By.css('input[name="name"]')), product.name);
	await demoPause();
	await typeSlow(await waitForElement(driver, By.css('textarea[name="description"]')), product.description);
	await demoPause();
	await fillInput(await waitForElement(driver, By.css('input[name="price"]')), product.price.toString());
	await demoPause();
	await fillInput(await waitForElement(driver, By.css('input[name="stock_quantity"]')), product.stock_quantity.toString());
	await demoPause();

	const imageInput = await waitForElement(driver, By.css('input[name="image_url"]'));
	await fillInput(imageInput, product.image_url);
	await demoPause();

	await selectCategory(driver);
	await demoPause();

	const submitButton = await waitForElement(driver, By.css('.product-modal button[type="submit"], .modal.show button[type="submit"]'));
	await scrollIntoView(driver, submitButton);
	await submitButton.click();
	await demoPause();

	await driver.wait(async () => {
		const modals = await driver.findElements(By.css('.product-modal.show, .modal.show'));
		return modals.length === 0;
	}, config.waitTimeout * 2, 'La boîte de dialogue de création produit est restée ouverte trop longtemps.');

	await waitShort(1500);
}

async function selectCategory(driver) {
	const selectElement = await waitForElement(driver, By.css('select[name="category"]'));
	await driver.wait(async () => {
		const options = await selectElement.findElements(By.css('option[value]:not([value=""])'));
		return options.length > 0;
	}, config.waitTimeout, 'Aucune catégorie disponible dans la liste.');

	const options = await selectElement.findElements(By.css('option[value]:not([value=""])'));
	let chosen = options[0];

	if (config.categoryKeyword) {
		const keyword = config.categoryKeyword;
		for (const option of options) {
			const text = (await option.getText()).toLowerCase();
			if (text.includes(keyword)) {
				chosen = option;
				break;
			}
		}
	}

	const value = await chosen.getAttribute('value');
	await driver.executeScript(
		`const select = arguments[0];
		const value = arguments[1];
		select.value = value;
		const event = new Event('change', { bubbles: true });
		select.dispatchEvent(event);`,
		selectElement,
		value
	);

	return value;
}

async function assertProductVisibleInAdminList(driver, productName) {
	const normalized = productName.toLowerCase();
	await driver.wait(async () => {
		const rows = await driver.findElements(By.css('table tbody tr'));
		if (!rows.length) return false;
		for (const row of rows) {
			const text = (await row.getText()).toLowerCase();
			if (text.includes(normalized)) {
				return true;
			}
		}
		return false;
	}, config.waitTimeout * 2, `Le produit ${productName} n’est pas apparu dans la liste administrateur.`);
}

async function assertProductVisibleInPublicListing(driver, productName) {
	const url = new URL(`${config.baseUrl}/products`);
	url.searchParams.set('keyword', productName);
	await driver.get(url.toString());
	await demoPause();

	await waitForElement(driver, By.css('.product-list-container'));

	await driver.wait(async () => {
		const cards = await driver.findElements(By.css('.product-card'));
		if (!cards.length) {
			return false;
		}
		for (const card of cards) {
			const titleElement = await card.findElement(By.css('.product-title'));
			const text = (await titleElement.getText()).trim();
			if (text === productName) {
				return true;
			}
		}
		return false;
	}, config.waitTimeout * 2, `Le produit ${productName} n’est pas visible dans la liste publique.`);
}

async function deleteProductViaApi(token, productName) {
	if (!token) {
		console.warn('⚠️ Aucun token disponible pour supprimer le produit de test.');
		return;
	}

	const client = axios.create({
		baseURL: config.apiBaseUrl,
		timeout: config.networkTimeout,
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	try {
		const { data } = await client.get('/products', {
			params: { keyword: productName, limit: 1 }
		});
		const product = data?.products?.find((p) => p.name === productName);
		if (!product) {
			console.warn('⚠️ Produit de test introuvable via l’API, nettoyage ignoré.');
			return;
		}
		await client.delete(`/products/${product._id}`);
		console.log('✅ Produit de test supprimé côté API.');
	} catch (error) {
		console.warn('⚠️ Impossible de nettoyer le produit via l’API:', error.response?.data || error.message);
	}
}

async function observeAndFixInvalidEmail(driver, emailInput, submitButton) {
	console.log('🚧 Démonstration : email invalide, recherche du message d’erreur...');
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

async function waitForElement(driver, locator) {
	const element = await driver.wait(until.elementLocated(locator), config.waitTimeout);
	await driver.wait(until.elementIsVisible(element), config.waitTimeout);
	return element;
}

async function scrollIntoView(driver, element) {
	await driver.executeScript('arguments[0].scrollIntoView({ block: "center" });', element);
	await driver.wait(until.elementIsVisible(element), config.waitTimeout);
	await driver.wait(until.elementIsEnabled(element), config.waitTimeout);
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

function waitShort(duration = 500) {
	return delay(Math.max(duration, config.demoDelay));
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function demoPause(multiplier = 1) {
	if (!config.demoDelay || config.demoDelay <= 0) return;
	await delay(config.demoDelay * multiplier);
}

async function holdBrowserOpen() {
	return new Promise(() => {});
}

run();
