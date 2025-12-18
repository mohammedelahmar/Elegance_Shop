#!/usr/bin/env node
// Script E2E critique pour vérifier la capacité d'un admin à créer un produit
// via l'interface graphique et à le voir apparaître côté public. Tous les 
// commentaires sont en français pour faciliter la relecture rapide du scénario.

import 'dotenv/config';
import axios from 'axios';
import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

// Construction de la configuration à partir des variables d'environnement.
// On l'évalue une seule fois pour la rendre accessible à toutes les fonctions utilitaires.
const config = buildConfig();

// Point d'entrée principal : orchestre le scénario complet
// 1) ouvre Chrome (optionnellement en mode headless)
// 2) se connecte en admin
// 3) crée un produit via l'UI
// 4) vérifie la présence côté admin et côté public
// 5) nettoie via l'API si configuré
async function run() {
	let driver;
	const chromeOptions = new chrome.Options()
		.addArguments('--disable-gpu', '--window-size=1920,1080', '--no-sandbox', '--disable-dev-shm-usage');

	if (config.headless) {
		chromeOptions.addArguments('--headless=new');
	}

	// Génère un produit unique (nom horodaté) à injecter dans l'UI
	const productUnderTest = buildProductCandidate();

	try {
		driver = await new Builder()
			.forBrowser('chrome')
			.setChromeOptions(chromeOptions)
			.build();

		console.log('🔐 Connexion administrateur en cours...');
		// Retourne le token JWT stocké en localStorage après login
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

		// Nettoyage optionnel pour ne pas polluer la base de données avec des produits de test
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

// Prépare et valide l'ensemble des variables de configuration nécessaires au test.
// Tout est surchargeable via des variables d'environnement pour s'adapter aux environnements CI/CD.
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

	// Vérifie que les identifiants admin sont bien fournis, sinon on arrête le test.
	const missing = [];
	if (!adminEmail) missing.push('E2E_ADMIN_EMAIL');
	if (!adminPassword) missing.push('E2E_ADMIN_PASSWORD');
	if (missing.length) {
		throw new Error(`Variables d’environnement manquantes: ${missing.join(', ')}`);
	}

	// Contrôles basiques pour éviter d'injecter des valeurs incohérentes dans le formulaire.
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

// Crée un produit éphémère avec un suffixe temporel pour éviter les collisions de nom.
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

// Effectue un parcours de connexion administrateur :
// - saisit volontairement de mauvaises valeurs pour valider les messages d'erreur
// - corrige automatiquement les champs puis soumet à nouveau
// - attend l'apparition du token JWT en localStorage
async function loginAsAdmin(driver) {
	await driver.get(`${config.baseUrl}/login`);
	await demoPause();

	// Étape 1 : taper un email invalide pour déclencher la validation HTML/UX
	const emailInput = await waitForElement(driver, By.css('input[type="email"], input[name="email"]'));
	await typeSlow(emailInput, 'wrong-email.com');
	await demoPause();

	// Étape 2 : taper un mot de passe erroné pour simuler une mauvaise tentative
	const passwordInput = await waitForElement(driver, By.css('input[type="password"], input[name="password"]'));
	const wrongPassword = `${config.credentials.password || 'password'}_wrong`;
	await typeSlow(passwordInput, wrongPassword);
	await demoPause();

	// Soumission initiale pour observer les feedbacks d'erreur
	const submitButton = await waitForElement(driver, By.css('button[type="submit"]'));
	await submitButton.click();
	await demoPause();

	// Étapes correctives : écouter/attendre les messages d'erreur puis corriger les champs
	await observeAndFixInvalidEmail(driver, emailInput, submitButton);
	await observeAndFixInvalidPassword(driver, passwordInput, submitButton);
	await demoPause();

	// On attend que le token admin soit bien stocké, signe d'une authentification réussie
	await driver.wait(async () => {
		const token = await driver.executeScript('return window.localStorage.getItem("userToken");');
		return Boolean(token);
	}, config.waitTimeout, 'Le token administrateur n’a pas été stocké après la connexion.');

	return driver.executeScript('return window.localStorage.getItem("userToken");');
}

// Assure que l'on est bien sur la page produits admin (URL + éléments clés visibles)
async function waitForAdminProductsPage(driver) {
	await driver.wait(until.urlContains('/admin/products'), config.waitTimeout);
	await waitForElement(driver, By.css('.products-admin-actions, .admin-page-container'));
	await waitForElement(driver, By.css('table.category-table, table'));
}

// Renseigne et soumet le formulaire d'ajout de produit depuis le back-office.
async function createProductViaUi(driver, product) {
	const addButton = await waitForElement(
		driver,
		By.xpath("//button[contains(text(),'Add Product') or contains(text(),'Add new product') or contains(text(),'Ajouter')]")
	);
	await scrollIntoView(driver, addButton);
	await addButton.click();
	await demoPause();

	// Attente de l'ouverture effective du modal
	await waitForElement(driver, By.css('.product-modal.show, .modal.show'));

	// Remplissage progressif des champs pour conserver un rendu « humain » (typeSlow/fillInput)
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

	// Sélectionne une catégorie disponible (optionnellement filtrée par mot-clé)
	await selectCategory(driver);
	await demoPause();

	// Soumet le formulaire puis attend la fermeture du modal comme signal de succès
	const submitButton = await waitForElement(driver, By.css('.product-modal button[type="submit"], .modal.show button[type="submit"]'));
	await scrollIntoView(driver, submitButton);
	await submitButton.click();
	await demoPause();

	await driver.wait(async () => {
		const modals = await driver.findElements(By.css('.product-modal.show, .modal.show'));
		return modals.length === 0;
	}, config.waitTimeout * 2, 'La boîte de dialogue de création produit est restée ouverte trop longtemps.');

	// Petite pause pour laisser le tableau se rafraîchir
	await waitShort(1500);
}

// Choisit une catégorie dans la liste déroulante.
// Préférence : la première disponible, ou celle qui contient le mot-clé configuré.
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

// Vérifie que le produit apparaît bien dans le tableau d'administration.
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

// Vérifie que le produit créé est visible côté catalogue public (filtré par mot-clé).
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

// Supprime le produit de test via l'API (nettoyage) en utilisant le token admin obtenu lors du login.
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

// Observation pédagogique : on force une erreur d'email puis on corrige automatiquement
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

// Même principe que pour l'email : on provoque puis corrige un mot de passe incorrect
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

// Attente utilitaire : localise un élément puis s'assure qu'il est visible
async function waitForElement(driver, locator) {
	const element = await driver.wait(until.elementLocated(locator), config.waitTimeout);
	await driver.wait(until.elementIsVisible(element), config.waitTimeout);
	return element;
}

// Fait défiler la page jusqu'à l'élément cible et vérifie sa visibilité/activabilité
async function scrollIntoView(driver, element) {
	await driver.executeScript('arguments[0].scrollIntoView({ block: "center" });', element);
	await driver.wait(until.elementIsVisible(element), config.waitTimeout);
	await driver.wait(until.elementIsEnabled(element), config.waitTimeout);
}

// Remplace entièrement le contenu d'un champ et saisit la nouvelle valeur
async function fillInput(element, value) {
	const modifier = process.platform === 'darwin' ? Key.COMMAND : Key.CONTROL;
	await element.click();
	await element.sendKeys(Key.chord(modifier, 'a'));
	await element.sendKeys(Key.BACK_SPACE);
	await element.sendKeys(value);
}

// Simule une saisie humaine lente pour mieux visualiser le scénario (démonstrations)
async function typeSlow(element, value) {
	for (const char of value.toString()) {
		await element.sendKeys(char);
		await delay(80);
	}
	await demoPause();
}

// Attente courte respectant la latence de démonstration configurable
function waitShort(duration = 500) {
	return delay(Math.max(duration, config.demoDelay));
}

// Promise utilitaire pour temporiser
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Pause douce utilisée partout pour ralentir volontairement le scénario
async function demoPause(multiplier = 1) {
	if (!config.demoDelay || config.demoDelay <= 0) return;
	await delay(config.demoDelay * multiplier);
}

// Garde le navigateur ouvert en mode démo (scénario observé à la main)
async function holdBrowserOpen() {
	return new Promise(() => {});
}

run();
