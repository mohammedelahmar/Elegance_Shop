#!/usr/bin/env node
import 'dotenv/config';
import assert from 'node:assert/strict';
import axios from 'axios';
import { MongoClient, ObjectId } from 'mongodb';
import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

/**
 * Test critique d'inventaire : ce script E2E reproduit un parcours complet (login ➜ panier ➜ paiement)
 * puis vérifie la décrémentation réelle du stock dans MongoDB. L'objectif est de garantir que la chaîne
 * UI ↔ API ↔ base de données reste cohérente même en conditions réelles.
 */
const config = buildConfig();

/**
 * Point d'entrée du scénario : instancie le navigateur, exécute le flux métier et compare le stock initial/final.
 */
async function run() {
	const chromeOptions = new chrome.Options()
		.addArguments('--disable-gpu', '--window-size=1920,1080', '--no-sandbox', '--disable-dev-shm-usage');

	if (config.headless) {
		chromeOptions.addArguments('--headless=new');
	}

	let driver;
	const mongoClient = new MongoClient(config.mongoUri, {
		serverSelectionTimeoutMS: config.waitTimeout
	});

	try {
		// 1) Connexion à la base et récupération de la collection produit.
		await mongoClient.connect();
		const db = mongoClient.db(config.mongoDbName);
		const productsCollection = db.collection('products');

		// 2) Lecture du stock initial et garde-fou sur la quantité demandée.
		const initialStock = await fetchProductStock(productsCollection, config.productObjectId);
		assert.ok(initialStock >= config.productQuantity, `Not enough stock (${initialStock}) for requested quantity (${config.productQuantity}).`);

		// 3) Initialisation de WebDriver (mode headless configurable).
		driver = await new Builder()
			.forBrowser('chrome')
			.setChromeOptions(chromeOptions)
			.build();

		console.log('🔐 Connexion utilisateur en cours...');
		const token = await loginAndGetToken(driver);
		console.log('🧹 Nettoyage du panier côté API...');
		await clearRemoteCart(token);

		console.log('🛒 Ajout du produit au panier via l’UI...');
		await addProductToCart(driver);

		console.log('📦 Passage à la caisse et paiement...');
		const orderId = await completeCheckout(driver);

		console.log('🧮 Vérification de la décrémentation du stock MongoDB...');
		const finalStock = await waitForStockDecrease(productsCollection, config.productObjectId, initialStock, config.productQuantity, {
			attempts: config.stockPollAttempts,
			delayMs: config.stockPollIntervalMs
		});

		assert.strictEqual(initialStock - finalStock, config.productQuantity, 'La quantité en stock ne correspond pas à la quantité commandée.');

		console.log('✅ Test critique réussi :', {
			produit: config.productId,
			commande: orderId,
			stockInitial: initialStock,
			stockFinal: finalStock,
			décrément: initialStock - finalStock
		});
	} catch (error) {
		console.error('❌ Échec du test critique d’inventaire:', error);
		process.exitCode = 1;
	} finally {
		if (driver) {
			await driver.quit();
		}
		await mongoClient.close();
	}
}

/**
 * Lit les variables d'environnement, applique des valeurs par défaut et valide les paramètres requis.
 * Retourne un objet de configuration partagé par l'ensemble du test.
 */
function buildConfig() {
	const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:3000';
	const apiBaseUrl = process.env.E2E_API_BASE_URL || 'http://localhost:5000/api';
	const email = process.env.E2E_USER_EMAIL;
	const password = process.env.E2E_USER_PASSWORD;
	const productId = process.env.E2E_PRODUCT_ID;
	const productQuantity = Number.parseInt(process.env.E2E_PRODUCT_QUANTITY ?? '1', 10);
	const mongoUri = process.env.MONGO_URI;
	const mongoDbName = process.env.MONGO_DB_NAME || extractDbNameFromUri(mongoUri);
	const waitTimeout = Number.parseInt(process.env.E2E_WAIT_TIMEOUT ?? '20000', 10);
	const networkTimeout = Number.parseInt(process.env.E2E_API_TIMEOUT ?? '15000', 10);
	const stockPollAttempts = Number.parseInt(process.env.E2E_STOCK_ATTEMPTS ?? '10', 10);
	const stockPollIntervalMs = Number.parseInt(process.env.E2E_STOCK_INTERVAL ?? '3000', 10);
	const headless = (process.env.E2E_HEADLESS ?? 'true').toLowerCase() !== 'false';

	const shippingDefaults = {
		address: process.env.E2E_SHIPPING_ADDRESS || '123 Rue du Test',
		city: process.env.E2E_SHIPPING_CITY || 'Paris',
		postalCode: process.env.E2E_SHIPPING_POSTAL || '75000',
		country: process.env.E2E_SHIPPING_COUNTRY || 'France',
		phone: process.env.E2E_SHIPPING_PHONE || '0600000000'
	};

	const missing = [];
	if (!email) missing.push('E2E_USER_EMAIL');
	if (!password) missing.push('E2E_USER_PASSWORD');
	if (!productId) missing.push('E2E_PRODUCT_ID');
	if (!mongoUri) missing.push('MONGO_URI');
	if (!mongoDbName) missing.push('MONGO_DB_NAME (ou inclure le nom de la base dans MONGO_URI)');
	if (!Number.isFinite(productQuantity) || productQuantity <= 0) {
		throw new Error('E2E_PRODUCT_QUANTITY doit être un entier positif.');
	}

	let productObjectId;
	try {
		productObjectId = new ObjectId(productId);
	} catch (error) {
		throw new Error('E2E_PRODUCT_ID doit être un ObjectId MongoDB valide.');
	}

	if (missing.length) {
		throw new Error(`Variables d’environnement manquantes: ${missing.join(', ')}`);
	}

	return {
		baseUrl,
		apiBaseUrl,
		credentials: { email, password },
		productId,
		productObjectId,
		productQuantity,
		mongoUri,
		mongoDbName,
		waitTimeout,
		networkTimeout,
		headless,
		stockPollAttempts,
		stockPollIntervalMs,
		shippingDefaults
	};
}

/**
 * Simule la connexion utilisateur via l'UI et renvoie le token JWT stocké côté navigateur.
 */
async function loginAndGetToken(driver) {
	await driver.get(`${config.baseUrl}/login`);

	const emailInput = await waitForElement(driver, By.css('input[type="email"]'));
	await emailInput.sendKeys(config.credentials.email);

	const passwordInput = await waitForElement(driver, By.css('input[type="password"]'));
	await passwordInput.sendKeys(config.credentials.password);

	const submitButton = await waitForElement(driver, By.css('button[type="submit"]'));
	await submitButton.click();

	await driver.wait(async () => {
		const token = await driver.executeScript('return window.localStorage.getItem("userToken");');
		return Boolean(token);
	}, config.waitTimeout, 'Le token utilisateur n’a pas été trouvé dans le localStorage après la connexion.');

	return driver.executeScript('return window.localStorage.getItem("userToken");');
}

/**
 * Vide le panier via l'API afin de partir d'un état propre avant de manipuler l'UI.
 */
async function clearRemoteCart(token) {
	const client = axios.create({
		baseURL: config.apiBaseUrl,
		timeout: config.networkTimeout,
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	try {
		await client.delete('/cart');
	} catch (error) {
		console.warn('Impossible de nettoyer le panier via l’API (ignoré):', error.response?.data || error.message);
	}
}

/**
 * Ouvre la page produit, applique les variantes nécessaires et dépose l'article dans le panier.
 */
async function addProductToCart(driver) {
	await driver.get(`${config.baseUrl}/products/${config.productId}`);

	await maybeSelectVariantOptions(driver);
	await adjustQuantity(driver, config.productQuantity);

	const addToCartButton = await waitForElement(driver, By.css('.add-to-cart-main-btn'));
	await scrollIntoView(driver, addToCartButton);
	await addToCartButton.click();

	await driver.wait(until.elementLocated(By.css('.alert-success, .alert.alert-success')), config.waitTimeout);
}

/**
 * Choisit automatiquement une taille et une couleur disponible pour éviter les blocages sur les produits configurables.
 */
async function maybeSelectVariantOptions(driver) {
	const sizeSelects = await driver.findElements(By.css('.size-section select'));
	if (sizeSelects.length) {
		const select = sizeSelects[0];
		await scrollIntoView(driver, select);
		const options = await select.findElements(By.css('option:not([disabled])'));
		const selectable = await filterSelectableOptions(options);
		if (!selectable.length) {
			throw new Error('Aucune taille disponible pour ce produit.');
		}
		await selectable[0].click();
		await waitShort();
	}

	const colorOptions = await driver.findElements(By.css('.color-section .color-option:not(.out-of-stock)'));
	if (colorOptions.length) {
		await scrollIntoView(driver, colorOptions[0]);
		await colorOptions[0].click();
		await waitShort();
	}
}

/**
 * Ajuste la quantité demandée en cliquant sur le bouton d'incrément autant de fois que nécessaire.
 */
async function adjustQuantity(driver, quantity) {
	if (quantity <= 1) return;
	const buttons = await driver.findElements(By.css('.quantity-section .quantity-btn'));
	if (buttons.length < 2) return;
	const incrementButton = buttons[1];

	for (let i = 1; i < quantity; i += 1) {
		await incrementButton.click();
		await waitShort();
	}
}

/**
 * Navigue jusqu'au tunnel de checkout et enchaîne les étapes expédition/paiement/revue.
 */
async function completeCheckout(driver) {
	await driver.get(`${config.baseUrl}/cart`);
	const checkoutButton = await waitForElement(driver, By.css('.checkout-btn'));
	await scrollIntoView(driver, checkoutButton);
	await checkoutButton.click();

	await driver.wait(until.urlContains('/checkout'), config.waitTimeout);

	await completeShippingStep(driver);
	await completePaymentStep(driver);
	return completeReviewAndPayment(driver);
}

/**
 * Renseigne les informations d'expédition si le formulaire est présent.
 */
async function completeShippingStep(driver) {
	await waitForElement(driver, By.css('.checkout-card'));
	const addressField = await findOptionalInput(driver, 'Enter your street address');
	if (addressField) {
		await fillInput(addressField, config.shippingDefaults.address);
		await fillByPlaceholder(driver, 'Enter your city', config.shippingDefaults.city);
		await fillByPlaceholder(driver, 'Enter postal code', config.shippingDefaults.postalCode);
		await fillByPlaceholder(driver, 'Enter your country', config.shippingDefaults.country);
		await fillByPlaceholder(driver, 'Enter phone number', config.shippingDefaults.phone, false);
	}

	const continueButton = await waitForElement(driver, By.xpath('//button[contains(., "Continue to Payment")]'));
	await scrollIntoView(driver, continueButton);
	await continueButton.click();
	await driver.wait(until.elementLocated(By.css('.checkout-card h5')), config.waitTimeout);
}

/**
 * Sélectionne un mode de paiement et passe à l'écran de revue de commande.
 */
async function completePaymentStep(driver) {
	const creditRadio = await waitForElement(driver, By.css('input[value="credit_card"]'));
	await driver.executeScript('arguments[0].click();', creditRadio);

	const continueButton = await waitForElement(driver, By.xpath('//button[contains(., "Continue to Review")]'));
	await scrollIntoView(driver, continueButton);
	await continueButton.click();
}

/**
 * Presse le bouton de commande, remplit la modale de carte et récupère l'identifiant de commande.
 */
async function completeReviewAndPayment(driver) {
	const placeOrderButton = await waitForElement(driver, By.xpath('//button[contains(., "Place Order")]'));
	await scrollIntoView(driver, placeOrderButton);
	await placeOrderButton.click();

	await fillCreditCardModal(driver);

	await driver.wait(until.urlContains('/payment-success/'), config.waitTimeout * 2);
	const successUrl = await driver.getCurrentUrl();
	const orderIdMatch = successUrl.match(/payment-success\/([^/?]+)/);
	return orderIdMatch ? orderIdMatch[1] : null;
}

/**
 * Remplit la modale de paiement avec des données de carte bancaires fictives.
 */
async function fillCreditCardModal(driver) {
	const cardNumber = await waitForElement(driver, By.css('input[name="cardNumber"]'));
	await fillInput(cardNumber, '4111 1111 1111 1111');

	const holder = await waitForElement(driver, By.css('input[name="cardholderName"]'));
	await fillInput(holder, 'Test User');

	const expiry = await waitForElement(driver, By.css('input[name="expiryDate"]'));
	await fillInput(expiry, '12/30');

	const cvv = await waitForElement(driver, By.css('input[name="cvv"]'));
	await fillInput(cvv, '123');

	const payButton = await waitForElement(driver, By.xpath('//button[contains(., "Pay Now")]'));
	await payButton.click();
}

/**
 * Lit la quantité en stock du produit cible dans MongoDB et valide le format de la donnée.
 */
async function fetchProductStock(collection, productId) {
	const product = await collection.findOne({ _id: productId }, { projection: { stock_quantity: 1 } });
	if (!product) {
		throw new Error(`Produit introuvable pour l’ID ${productId.toString()}`);
	}
	if (typeof product.stock_quantity !== 'number') {
		throw new Error('Le champ stock_quantity est manquant ou invalide.');
	}
	return product.stock_quantity;
}

/**
 * Patiente jusqu'à ce que la base reflète la décrémentation attendue du stock, avec un nombre maximal d'essais.
 */
async function waitForStockDecrease(collection, productId, initialStock, expectedDecrease, { attempts, delayMs }) {
	for (let attempt = 1; attempt <= attempts; attempt += 1) {
		const currentStock = await fetchProductStock(collection, productId);
		if (currentStock <= initialStock - expectedDecrease) {
			return currentStock;
		}
		await delay(delayMs);
	}
	throw new Error('Le stock ne s’est pas décrémenté comme prévu dans le délai imparti.');
}

/**
 * Wrapper utilitaire pour `driver.wait` avec le timeout global.
 */
async function waitForElement(driver, locator) {
	return driver.wait(until.elementLocated(locator), config.waitTimeout);
}

/**
 * Scroll jusqu'à l'élément cible et vérifie qu'il est visible/enabled avant interaction.
 */
async function scrollIntoView(driver, element) {
	await driver.executeScript('arguments[0].scrollIntoView({ block: "center" });', element);
	await driver.wait(until.elementIsVisible(element), config.waitTimeout);
	await driver.wait(until.elementIsEnabled(element), config.waitTimeout);
}

/**
 * Filtre les options de select en retirant celles qui sont désactivées ou sans valeur.
 */
async function filterSelectableOptions(options) {
	const enabled = [];
	for (const option of options) {
		const disabled = await option.getAttribute('disabled');
		const value = await option.getAttribute('value');
		if (!disabled && value) {
			enabled.push(option);
		}
	}
	return enabled;
}

/**
 * Recherche un champ par placeholder et retourne null si le champ n'existe pas.
 */
async function findOptionalInput(driver, placeholder) {
	const elements = await driver.findElements(By.xpath(`//input[@placeholder="${placeholder}"]`));
	return elements[0] || null;
}

/**
 * Tente de remplir un champ optionnel. Lève une erreur si `required` et que le champ est introuvable.
 */
async function fillByPlaceholder(driver, placeholder, value, required = true) {
	const element = await findOptionalInput(driver, placeholder);
	if (!element) {
		if (required) {
			throw new Error(`Impossible de trouver le champ avec placeholder "${placeholder}"`);
		}
		return;
	}
	await fillInput(element, value);
}

/**
 * Efface complètement la valeur d'un champ avant d'y injecter la nouvelle donnée.
 */
async function fillInput(element, value) {
	await element.click();
	const modifier = process.platform === 'darwin' ? Key.COMMAND : Key.CONTROL;
	await element.sendKeys(Key.chord(modifier, 'a'));
	await element.sendKeys(Key.BACK_SPACE);
	await element.sendKeys(value);
}

/**
 * Extrait le nom de base de données à partir d'une URI MongoDB classique ou SRV.
 */
function extractDbNameFromUri(uri) {
	if (!uri) return null;
	const match = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^/?]+)/i);
	return match ? match[1] : null;
}

/**
 * Renvoie une promesse qui se résout après `ms` millisecondes.
 */
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Petite pause (300 ms) utilisée pour laisser l'UI se stabiliser entre deux actions.
 */
function waitShort() {
	return delay(300);
}

run();
