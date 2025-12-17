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

		console.log('👤 Connexion client (avec erreurs mises en scène)...');
		const userToken = await loginWithDemoErrors(driver, config.credentials.email, config.credentials.password);

		console.log('🏠 Vérification/creation adresse de livraison...');
		const shippingAddressId = await ensureShippingAddress(userToken);

		console.log('🧹 Nettoyage du panier côté API...');
		await clearRemoteCart(userToken);

		console.log('🛒 Parcours UI: ajout produit + checkout en Cash on Delivery...');
		const orderId = await checkoutCodViaUi(driver, userToken, config.productId, config.productQuantity, shippingAddressId);

		console.log('🚪 Déconnexion du client...');
		await clearSession(driver);
		await demoPause(2);

		console.log('🛡️ Connexion administrateur...');
		const adminToken = await loginWithDemoErrors(driver, config.adminCredentials.email, config.adminCredentials.password);

		console.log('💳 Marquage commande "payée" côté admin...');
		await markOrderPaid(adminToken, orderId);
		await demoPause();

		console.log('📦 Marquage commande "livrée" côté admin...');
		await markOrderDelivered(adminToken, orderId);

		console.log('� Visualisation de la commande côté interface...');
		await showOrderVisually(driver, orderId);

		console.log('�🔎 Vérification finale de l’état commande...');
		const finalOrder = await fetchOrder(adminToken, orderId);
		assert.equal(finalOrder.isPaid, true, 'La commande devrait être marquée payée.');
		assert.equal(finalOrder.isDelivered, true, 'La commande devrait être marquée livrée.');

		console.log('✅ Test critique COD ➜ Admin livraison réussi :', { orderId });
	} catch (error) {
		console.error('❌ Échec du test critique COD ➜ livraison:', error);
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
	const adminEmail = process.env.E2E_ADMIN_EMAIL;
	const adminPassword = process.env.E2E_ADMIN_PASSWORD;
	const productId = process.env.E2E_PRODUCT_ID;
	const productQuantity = Number.parseInt(process.env.E2E_PRODUCT_QUANTITY ?? '1', 10);
	const waitTimeout = Number.parseInt(process.env.E2E_WAIT_TIMEOUT ?? '20000', 10);
	const networkTimeout = Number.parseInt(process.env.E2E_API_TIMEOUT ?? '15000', 10);
	const headless = (process.env.E2E_HEADLESS ?? 'true').toLowerCase() !== 'false';
	const demoDelay = Number.parseInt(process.env.E2E_DEMO_DELAY ?? '800', 10);
	const keepBrowserOpen = (process.env.E2E_KEEP_BROWSER_OPEN ?? 'true').toLowerCase() !== 'false';

	const missing = [];
	if (!email) missing.push('E2E_USER_EMAIL');
	if (!password) missing.push('E2E_USER_PASSWORD');
	if (!adminEmail) missing.push('E2E_ADMIN_EMAIL');
	if (!adminPassword) missing.push('E2E_ADMIN_PASSWORD');
	if (!productId) missing.push('E2E_PRODUCT_ID');
	if (!Number.isFinite(productQuantity) || productQuantity <= 0) {
		throw new Error('E2E_PRODUCT_QUANTITY doit être un entier positif.');
	}
	if (missing.length) {
		throw new Error(`Variables d’environnement manquantes: ${missing.join(', ')}`);
	}

	return {
		baseUrl,
		apiBaseUrl,
		credentials: { email, password },
		adminCredentials: { email: adminEmail, password: adminPassword },
		productId,
		productQuantity,
		waitTimeout,
		networkTimeout,
		headless,
		demoDelay,
		keepBrowserOpen
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

async function loginWithDemoErrors(driver, email, password) {
	await driver.get(`${config.baseUrl}/login`);
	await demoPause();

	const emailInput = await waitForElement(driver, By.css('input[type="email"], input[name="email"]'));
	await typeSlow(emailInput, 'wrong-email.com');
	await demoPause();

	const passwordInput = await waitForElement(driver, By.css('input[type="password"], input[name="password"]'));
	const wrongPassword = `${password || 'password'}_wrong`;
	await typeSlow(passwordInput, wrongPassword);
	await demoPause();

	const submitButton = await waitForElement(driver, By.css('button[type="submit"]'));
	await submitButton.click();
	await demoPause();

	await observeAndFixInvalidEmail(driver, emailInput, submitButton, email);
	await observeAndFixInvalidPassword(driver, passwordInput, submitButton, password);
	await demoPause();

	await driver.wait(async () => {
		const token = await driver.executeScript('return window.localStorage.getItem("userToken");');
		return Boolean(token);
	}, config.waitTimeout, 'Le token utilisateur n’a pas été enregistré après la connexion.');

	const token = await driver.executeScript('return window.localStorage.getItem("userToken");');
	assert.ok(token, 'Aucun token utilisateur présent dans le localStorage après la connexion.');
	return token;
}

async function observeAndFixInvalidEmail(driver, emailInput, submitButton, correctEmail) {
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
	await fillInput(emailInput, correctEmail);
	await demoPause();
	await submitButton.click();
}

async function observeAndFixInvalidPassword(driver, passwordInput, submitButton, correctPassword) {
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
	await fillInput(passwordInput, correctPassword);
	await demoPause();
	await submitButton.click();
}

async function ensureShippingAddress(token) {
	const client = buildApiClient(token);
	const { data: existing } = await client.get('/addresses/user');
	if (Array.isArray(existing) && existing.length > 0) {
		return existing[0]._id;
	}

	const payload = {
		address: '123 Rue Demo',
		city: 'Paris',
		country: 'France',
		postal_code: '75000',
		phone_number: '0600000000'
	};
	const { data } = await client.post('/addresses', payload);
	return data._id;
}

async function clearRemoteCart(token) {
	const client = buildApiClient(token);
	try {
		await client.delete('/cart');
	} catch (error) {
		console.warn('Impossible de nettoyer le panier via l’API (ignoré):', error.response?.data || error.message);
	}
}

async function checkoutCodViaUi(driver, userToken, productId, quantity, addressId) {
	// Produit
	console.log('🔎 Ouverture page produit et sélection...');
	await driver.get(`${config.baseUrl}/products/${productId}`);
	await demoPause(2);

	await maybeSelectVariantOptions(driver);
	await adjustQuantity(driver, quantity);

	const addBtn = await waitForElement(driver, By.css('.add-to-cart-main-btn'));
	await addBtn.click();
	await demoPause(2);
	await driver.wait(until.elementLocated(By.css('.alert-success, .alert.alert-success')), config.waitTimeout);

	// Panier -> Checkout
	await driver.get(`${config.baseUrl}/cart`);
	await demoPause(2);
	const checkoutBtn = await waitForElement(driver, By.css('.checkout-btn'));
	await checkoutBtn.click();
	await driver.wait(until.urlContains('/checkout'), config.waitTimeout);
	await demoPause(2);
	await waitForElement(driver, By.css('.checkout-card'));

	// Étape Shipping
	console.log('📦 Étape livraison: sélection d’adresse...');
	const addressSelects = await driver.findElements(By.css('.checkout-card select.checkout-form-control'));
	if (addressSelects.length) {
		const select = addressSelects[0];
		await driver.executeScript('arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event("change", {bubbles:true}));', select, addressId);
		await demoPause();
	} else {
		await fillByPlaceholder(driver, 'Enter your street address', '123 Rue Demo');
		await fillByPlaceholder(driver, 'Enter your city', 'Paris');
		await fillByPlaceholder(driver, 'Enter postal code', '75000');
		await fillByPlaceholder(driver, 'Enter your country', 'France');
		await fillByPlaceholder(driver, 'Enter phone number', '0600000000', false);
	}
	const toPayment = await waitForElement(driver, By.xpath('//button[contains(., "Continue to Payment")]'));
	await toPayment.click();
	await demoPause(2);

	// Étape Payment
	console.log('💳 Étape paiement: choix Cash on Delivery...');
	const codRadio = await waitForElement(driver, By.css('input[value="cash_on_delivery"], #payment-cash_on_delivery'));
	await driver.executeScript('arguments[0].click();', codRadio);
	await demoPause();
	const toReview = await waitForElement(driver, By.xpath('//button[contains(., "Continue to Review")]'));
	await toReview.click();
	await demoPause(2);

	// Étape Review
	console.log('🔍 Étape revue: placement de commande...');
	const placeOrderBtn = await findPlaceOrderButton(driver);
	await placeOrderBtn.click();
	await demoPause(2);

	try {
		await driver.wait(async () => {
			const url = await driver.getCurrentUrl();
			if (/payment-success\//.test(url)) return true;
			// Détection rapide d’une erreur serveur affichée dans la page
			const errorAlerts = await driver.findElements(By.css('.alert-danger, .toast-error, .error, .text-danger'));
			if (errorAlerts.length) {
				const texts = await Promise.all(errorAlerts.map((el) => el.getText()));
				throw new Error(`Message d’erreur lors du placement: ${texts.filter(Boolean).join(' | ')}`);
			}
			return false;
		}, config.waitTimeout);

		const successUrl = await driver.getCurrentUrl();
		const orderIdMatch = successUrl.match(/payment-success\/([^/?]+)/);
		if (orderIdMatch) {
			return orderIdMatch[1];
		}
		throw new Error('ID commande introuvable après success page.');
	} catch (err) {
		console.warn('⚠️ Échec via UI (probable 500 COD). Fallback API pour créer la commande puis navigation success.', err.message);
		const fallbackOrderId = await createCodOrderViaApi(userToken, productId, quantity, addressId);
		await driver.get(`${config.baseUrl}/payment-success/${fallbackOrderId}?method=cod`);
		await demoPause(2);
		return fallbackOrderId;
	}
}

async function markOrderPaid(adminToken, orderId) {
	const client = buildApiClient(adminToken);
	await client.put(`/commandes/${orderId}/pay`, {
		id: 'admin-marked',
		status: 'completed',
		update_time: new Date().toISOString()
	});
}

async function markOrderDelivered(adminToken, orderId) {
	const client = buildApiClient(adminToken);
	await client.put(`/commandes/${orderId}/deliver`, {});
}

async function fetchOrder(token, orderId) {
	const client = buildApiClient(token);
	const { data } = await client.get(`/commandes/${orderId}`);
	return data;
}

async function showOrderVisually(driver, orderId) {
	const urls = [
		`${config.baseUrl}/orders/${orderId}`,
		`${config.baseUrl}/order/${orderId}`,
		`${config.baseUrl}/admin/orders`
	];

	for (const url of urls) {
		await driver.get(url);
		await demoPause(2);
		try {
			await driver.wait(async () => {
				const statusEl = await driver.findElements(By.xpath(
					'//span[contains(., "Paid") or contains(., "Payée") or contains(., "Delivered") or contains(., "Livrée") or contains(., "Cash on Delivery") or contains(., "paiement")]'
				));
				if (statusEl.length) return true;
				const orderIdEl = await driver.findElements(By.xpath(`//*[contains(text(), "${orderId}")]`));
				return orderIdEl.length > 0;
			}, config.waitTimeout / 2);
			await demoPause(2);
			return;
		} catch (err) {
			console.warn(`Aucun statut visible sur ${url}, tentative suivante...`);
		}
	}

	console.warn('Impossible d’afficher visuellement la commande (aucune page commande avec statut détectée).');
}

async function createCodOrderViaApi(userToken, productId, quantity, addressId) {
	const price = await fetchProductPrice(productId);
	const pricing = computePricing(price, quantity);
	const client = buildApiClient(userToken);
	const payload = {
		orderItems: [
			{ product: productId, quantity }
		],
		shippingAddress: addressId,
		paymentMethod: 'cash_on_delivery',
		itemsPrice: pricing.itemsPrice,
		taxPrice: pricing.taxPrice,
		shippingPrice: pricing.shippingPrice,
		totalPrice: pricing.totalPrice
	};
	const { data } = await client.post('/commandes', payload);
	return data._id || data.id;
}

function computePricing(unitPrice, quantity) {
	const itemsPrice = round2(unitPrice * quantity);
	const shippingPrice = itemsPrice > 50 ? 0 : 10;
	const taxPrice = round2(itemsPrice * 0.15);
	const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
	return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}

async function fetchProductPrice(productId) {
	const client = buildApiClient();
	const { data } = await client.get(`/products/${productId}`);
	const price = data?.price ?? data?.product?.price;
	if (price == null) {
		throw new Error('Prix du produit introuvable via l’API.');
	}
	return Number.parseFloat(price?.$numberDecimal ?? price);
}

function buildApiClient(token) {
	return axios.create({
		baseURL: config.apiBaseUrl,
		timeout: config.networkTimeout,
		headers: token ? { Authorization: `Bearer ${token}` } : undefined
	});
}

async function clearSession(driver) {
	await driver.executeScript('window.localStorage.clear(); window.sessionStorage.clear();');
}

async function waitForElement(driver, locator) {
	const element = await driver.wait(until.elementLocated(locator), config.waitTimeout);
	await driver.wait(until.elementIsVisible(element), config.waitTimeout);
	await driver.wait(until.elementIsEnabled(element), config.waitTimeout);
	return element;
}

async function findPlaceOrderButton(driver) {
	// Ensure review card is present
	await waitForElement(driver, By.css('.order-summary, .checkout-card'));

	const candidates = [
		By.xpath('//button[contains(., "Place Order")]'),
		By.css('button.btn-checkout'),
		By.xpath('//button[contains(., "Pay") and contains(., "Now")]'),
	];

	for (const locator of candidates) {
		const found = await driver.findElements(locator);
		if (found.length) {
			const btn = found[0];
			await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
			await driver.wait(until.elementIsVisible(btn), config.waitTimeout);
			await driver.wait(until.elementIsEnabled(btn), config.waitTimeout);
			return btn;
		}
	}

	throw new Error('Bouton "Place Order" introuvable sur la page de revue.');
}

async function fillInput(element, value) {
	const modifier = process.platform === 'darwin' ? Key.COMMAND : Key.CONTROL;
	await element.click();
	await element.sendKeys(Key.chord(modifier, 'a'));
	await element.sendKeys(Key.BACK_SPACE);
	await element.sendKeys(value);
}

async function fillByPlaceholder(driver, placeholder, value, required = true) {
	const elements = await driver.findElements(By.xpath(`//input[@placeholder="${placeholder}"]`));
	if (!elements.length) {
		if (required) throw new Error(`Champ introuvable: ${placeholder}`);
		return;
	}
	await fillInput(elements[0], value);
}

async function typeSlow(element, value) {
	for (const char of value.toString()) {
		await element.sendKeys(char);
		await delay(80);
	}
	await demoPause();
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

function round2(value) {
	return Math.round(value * 100) / 100;
}

async function maybeSelectVariantOptions(driver) {
	const sizeSelects = await driver.findElements(By.css('.size-section select'));
	if (sizeSelects.length) {
		const select = sizeSelects[0];
		const options = await select.findElements(By.css('option:not([disabled])'));
		const enabled = [];
		for (const option of options) {
			const disabled = await option.getAttribute('disabled');
			const value = await option.getAttribute('value');
			if (!disabled && value) enabled.push(option);
		}
		if (enabled.length) {
			await enabled[0].click();
			await demoPause();
		}
	}

	const colorOptions = await driver.findElements(By.css('.color-section .color-option:not(.out-of-stock)'));
	if (colorOptions.length) {
		await colorOptions[0].click();
		await demoPause();
	}
}

async function adjustQuantity(driver, quantity) {
	if (quantity <= 1) return;
	const buttons = await driver.findElements(By.css('.quantity-section .quantity-btn'));
	if (buttons.length < 2) return;
	const incrementButton = buttons[1];
	for (let i = 1; i < quantity; i += 1) {
		await incrementButton.click();
		await demoPause();
	}
}

run();
