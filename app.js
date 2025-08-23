let currentOrder = {};
let orderHistory = [];
let orderCounter = 1;
let drinks = [];
let foods = [];
const DRINKS_STORAGE_KEY = 'drinkOrderingApp.drinks';
const FOODS_STORAGE_KEY = 'drinkOrderingApp.foods';
const LANG_STORAGE_KEY = 'drinkOrderingApp.lang';
const ORDER_HISTORY_STORAGE_KEY = 'drinkOrderingApp.orderHistory';
const ORDER_COUNTER_STORAGE_KEY = 'drinkOrderingApp.orderCounter';
let currentLang = 'en';
let currentSubtab = 'drinks';
// translations are loaded from translations.js as global `translations`

function t(key) {
	const dict = translations[currentLang] || translations.en;
	return dict[key] || translations.en[key] || key;
}

function setLanguage(lang) {
	if (!translations[lang]) return;
	currentLang = lang;
	try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch {}
	setStaticText();
	updateCurrentOrder();
	updateDrinksGrid();
	updateFoodsGrid();
	updateManageDrinksList();
	updateManageFoodsList();
	updateOrderHistory();
	updateLanguageButtonsActive();
}

function loadLanguageFromStorage() {
	try {
		const saved = localStorage.getItem(LANG_STORAGE_KEY);
		if (saved && translations[saved]) {
			currentLang = saved;
		}
	} catch {}
}

function updateLanguageButtonsActive() {
	['en','nl','fr'].forEach(code => {
		const btn = document.getElementById('btn-lang-' + code);
		if (btn) {
			if (code === currentLang) btn.classList.add('active');
			else btn.classList.remove('active');
		}
	});
}

function setStaticText() {
	const titleEl = document.getElementById('header-title');
	if (titleEl) titleEl.innerHTML = '<img src="logo.png" alt="ST BETON Logo" class="header-logo">';
	const subEl = document.getElementById('header-subtitle');
	if (subEl) subEl.textContent = t('subtitle');
	const tabOrderBtn = document.getElementById('tab-order-btn');
	if (tabOrderBtn) {
		const tabText = tabOrderBtn.querySelector('.tab-text');
		if (tabText) tabText.textContent = t('tabOrder');
	}
	const tabManageBtn = document.getElementById('tab-manage-btn');
	if (tabManageBtn) {
		const tabText = tabManageBtn.querySelector('.tab-text');
		if (tabText) tabText.textContent = t('tabManage');
	}
	const tabHistoryBtn = document.getElementById('tab-history-btn');
	if (tabHistoryBtn) {
		const tabText = tabHistoryBtn.querySelector('.tab-text');
		if (tabText) tabText.textContent = t('tabHistory');
	}
	const subtabDrinksBtn = document.getElementById('subtab-drinks-btn');
	if (subtabDrinksBtn) subtabDrinksBtn.textContent = t('subtabDrinks');
	const subtabFoodsBtn = document.getElementById('subtab-foods-btn');
	if (subtabFoodsBtn) subtabFoodsBtn.textContent = t('subtabFoods');
	const addHeading = document.getElementById('add-drink-heading');
	if (addHeading) addHeading.textContent = t('addNewDrink');
	const labelName = document.getElementById('label-drink-name');
	if (labelName) labelName.textContent = t('drinkName');
	const inputName = document.getElementById('drink-name');
	if (inputName) inputName.placeholder = t('drinkNamePlaceholder');
	const labelPrice = document.getElementById('label-drink-price');
	if (labelPrice) labelPrice.textContent = t('drinkPrice');
	const labelEmoji = document.getElementById('label-drink-emoji');
	if (labelEmoji) labelEmoji.textContent = t('drinkEmoji');
	const addBtn = document.getElementById('add-drink-btn');
	if (addBtn) addBtn.textContent = t('addDrinkBtn');
	const manageHeading = document.getElementById('manage-drinks-heading');
	if (manageHeading) manageHeading.textContent = t('manageDrinks');
	const clearBtn = document.getElementById('clear-drinks-btn');
	if (clearBtn) clearBtn.textContent = t('clearDrinks');
	const addFoodHeading = document.getElementById('add-food-heading');
	if (addFoodHeading) addFoodHeading.textContent = t('addNewFood');
	const labelFoodName = document.getElementById('label-food-name');
	if (labelFoodName) labelFoodName.textContent = t('foodName');
	const inputFoodName = document.getElementById('food-name');
	if (inputFoodName) inputFoodName.placeholder = t('foodNamePlaceholder');
	const labelFoodPrice = document.getElementById('label-food-price');
	if (labelFoodPrice) labelFoodPrice.textContent = t('drinkPrice');
	const labelFoodEmoji = document.getElementById('label-food-emoji');
	if (labelFoodEmoji) labelFoodEmoji.textContent = t('drinkEmoji');
	const addFoodBtn = document.getElementById('add-food-btn');
	if (addFoodBtn) addFoodBtn.textContent = t('addFoodBtn');
	const manageFoodsHeading = document.getElementById('manage-foods-heading');
	if (manageFoodsHeading) manageFoodsHeading.textContent = t('manageFoods');
	const clearFoodsBtn = document.getElementById('clear-foods-btn');
	if (clearFoodsBtn) clearFoodsBtn.textContent = t('clearFoods');
	const menuIoHeading = document.getElementById('menu-io-heading');
	if (menuIoHeading) menuIoHeading.textContent = t('shareMenu');
	const exportMenuBtn = document.getElementById('export-menu-btn');
	if (exportMenuBtn) exportMenuBtn.textContent = t('exportMenu');
	const importMenuBtn = document.getElementById('import-menu-btn');
	if (importMenuBtn) importMenuBtn.textContent = t('importMenu');
	const loadDefaultsBtn = document.getElementById('load-defaults-btn');
	if (loadDefaultsBtn) loadDefaultsBtn.textContent = t('loadDefaults');
	const currentOrderTitle = document.getElementById('current-order-title');
	if (currentOrderTitle) currentOrderTitle.textContent = t('currentOrder');
	const tableNumberLabel = document.getElementById('table-number-label');
	if (tableNumberLabel) tableNumberLabel.textContent = t('tableNumberLabel');
	const doneBtn = document.getElementById('done-btn');
	if (doneBtn) doneBtn.textContent = t('orderCompleteBtn') + ' ✅';
	const totalDiv = document.getElementById('total');
	if (totalDiv) {
		const items = Object.keys(currentOrder);
		const total = items.reduce((sum, item) => sum + (currentOrder[item].price * currentOrder[item].quantity), 0);
		totalDiv.textContent = `${t('totalLabel')}: €${total.toFixed(2)}`;
	}
}

function loadDrinksFromStorage() {
	const saved = localStorage.getItem(DRINKS_STORAGE_KEY);
	if (saved) {
		try {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed)) {
				drinks = parsed;
			}
		} catch (error) {
			console.warn('Failed to parse saved drinks from storage:', error);
		}
	}
}

function saveDrinksToStorage() {
	try {
		localStorage.setItem(DRINKS_STORAGE_KEY, JSON.stringify(drinks));
	} catch (error) {
		console.warn('Failed to save drinks to storage:', error);
	}
}

function loadFoodsFromStorage() {
	const saved = localStorage.getItem(FOODS_STORAGE_KEY);
	if (saved) {
		try {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed)) {
				foods = parsed;
			}
		} catch (error) {
			console.warn('Failed to parse saved foods from storage:', error);
		}
	}
}

function saveFoodsToStorage() {
	try {
		localStorage.setItem(FOODS_STORAGE_KEY, JSON.stringify(foods));
	} catch (error) {
		console.warn('Failed to save foods to storage:', error);
	}
}

function loadOrderHistoryFromStorage() {
	const saved = localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);
	if (saved) {
		try {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed)) {
				// Convert timestamp strings back to Date objects
				orderHistory = parsed.map(order => ({
					...order,
					timestamp: new Date(order.timestamp)
				}));
			}
		} catch (error) {
			console.warn('Failed to parse saved order history from storage:', error);
		}
	}
	
	// Load order counter
	const savedCounter = localStorage.getItem(ORDER_COUNTER_STORAGE_KEY);
	if (savedCounter) {
		try {
			const counter = parseInt(savedCounter);
			if (!isNaN(counter)) {
				orderCounter = counter;
			}
		} catch (error) {
			console.warn('Failed to parse saved order counter from storage:', error);
		}
	}
}

function saveOrderHistoryToStorage() {
	try {
		localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orderHistory));
		localStorage.setItem(ORDER_COUNTER_STORAGE_KEY, orderCounter.toString());
	} catch (error) {
		console.warn('Failed to save order history to storage:', error);
	}
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
	loadLanguageFromStorage();
	setStaticText();
	updateLanguageButtonsActive();
	loadDrinksFromStorage();
	loadFoodsFromStorage();
	loadOrderHistoryFromStorage();
	updateDrinksGrid();
	updateFoodsGrid();
	updateManageDrinksList();
	updateManageFoodsList();
	updateOrderHistory();
});



function updateDrinksGrid() {
	const grid = document.getElementById('drinks-grid');
	let gridHTML = '';
	
	if (drinks.length === 0) {
		gridHTML = `
			<div class="empty-state">
				<div class="empty-state-icon">🍹</div>
				<h3>${t('emptyNoDrinks')}</h3>
				<p>${t('emptyGoAdd')}</p>
			</div>
		`;
	} else {
		drinks.forEach(drink => {
			gridHTML += `
				<div class="drink-item" onclick="addDrink('${drink.name}', ${drink.price})">
					<div class="drink-info">
						<div class="drink-icon">${drink.emoji}</div>
						<div class="drink-details">
							<h3>${drink.name}</h3>
						</div>
					</div>
					<div class="drink-price">€${drink.price.toFixed(2)}</div>
				</div>
			`;
		});
	}
	
	grid.innerHTML = gridHTML;
}

function updateFoodsGrid() {
	const grid = document.getElementById('foods-grid');
	if (!grid) return;
	let gridHTML = '';
	if (foods.length === 0) {
		gridHTML = `
			<div class="empty-state">
				<div class="empty-state-icon">🍽️</div>
				<h3>${t('emptyNoFoods')}</h3>
				<p>${t('emptyGoAddFoods')}</p>
			</div>
		`;
	} else {
		foods.forEach(food => {
			gridHTML += `
				<div class="drink-item" onclick="addDrink('${food.name}', ${food.price})">
					<div class="drink-info">
						<div class="drink-icon">${food.emoji}</div>
						<div class="drink-details">
							<h3>${food.name}</h3>
						</div>
					</div>
					<div class="drink-price">€${food.price.toFixed(2)}</div>
				</div>
			`;
		});
	}
	grid.innerHTML = gridHTML;
}

function updateManageDrinksList() {
	const list = document.getElementById('manage-drinks-list');
	let listHTML = '';
	
	if (drinks.length === 0) {
		listHTML = `
			<div class="empty-state">
				<div class="empty-state-icon">🍹</div>
				<h3>${t('emptyNoDrinks')}</h3>
				<p>${t('emptyManageAdd')}</p>
			</div>
		`;
	} else {
		drinks.forEach((drink, index) => {
			listHTML += `
				<div class="manage-drink-item">
					<div class="drink-info">
						<div class="drink-icon">${drink.emoji}</div>
					</div>
					<div class="drink-manage-info">
						<h4>${drink.name}</h4>
						<p>€${drink.price.toFixed(2)}</p>
					</div>
					<button class="delete-btn" onclick="deleteDrink(${index})">${t('delete')}</button>
				</div>
			`;
		});
	}
	
	list.innerHTML = listHTML;

	const clearBtn = document.getElementById('clear-drinks-btn');
	if (clearBtn) {
		clearBtn.disabled = drinks.length === 0;
	}
}

function updateManageFoodsList() {
	const list = document.getElementById('manage-foods-list');
	if (!list) return;
	let listHTML = '';
	if (foods.length === 0) {
		listHTML = `
			<div class="empty-state">
				<div class="empty-state-icon">🍽️</div>
				<h3>${t('emptyNoFoods')}</h3>
				<p>${t('emptyManageAddFoods')}</p>
			</div>
		`;
	} else {
		foods.forEach((food, index) => {
			listHTML += `
				<div class="manage-drink-item">
					<div class="drink-info">
						<div class="drink-icon">${food.emoji}</div>
					</div>
					<div class="drink-manage-info">
						<h4>${food.name}</h4>
						<p>€${food.price.toFixed(2)}</p>
					</div>
					<button class="delete-btn" onclick="deleteFood(${index})">${t('delete')}</button>
				</div>
			`;
		});
	}
	list.innerHTML = listHTML;

	const clearBtn = document.getElementById('clear-foods-btn');
	if (clearBtn) {
		clearBtn.disabled = foods.length === 0;
	}
}

function addNewDrink() {
	const name = document.getElementById('drink-name').value.trim();
	const description = '';
	const price = parseFloat(document.getElementById('drink-price').value);
	const emoji = document.getElementById('drink-emoji').value.trim() || '🥤';
	const messageDiv = document.getElementById('add-drink-message');
	
	// Validation
	if (!name) {
		showMessage(t('pleaseEnterName'), 'error');
		return;
	}
	
	if (isNaN(price) || price <= 0) {
		showMessage(t('pleaseEnterValidPrice'), 'error');
		return;
	}
	
	if (price > 999.99) {
		showMessage(t('priceTooHigh'), 'error');
		return;
	}
	
	// Check if drink already exists
	if (drinks.some(drink => drink.name.toLowerCase() === name.toLowerCase())) {
		showMessage(t('duplicateDrink'), 'error');
		return;
	}
	
	// Add the drink
	drinks.push({ name, description, price, emoji });
	saveDrinksToStorage();
	
	// Clear form
	document.getElementById('drink-name').value = '';
	// no description field
	document.getElementById('drink-price').value = '';
	document.getElementById('drink-emoji').value = '';
	
	// Update displays
	updateDrinksGrid();
	updateManageDrinksList();
	
	showMessage(t('addSuccess').replace('{name}', name), 'success');
}

function addNewFood() {
	const name = document.getElementById('food-name').value.trim();
	const description = '';
	const price = parseFloat(document.getElementById('food-price').value);
	const emoji = document.getElementById('food-emoji').value.trim() || '🍽️';
	const messageDiv = document.getElementById('add-food-message');

	if (!name) {
		showMessage(t('pleaseEnterFoodName'), 'error', messageDiv);
		return;
	}
	if (isNaN(price) || price <= 0) {
		showMessage(t('pleaseEnterValidPrice'), 'error', messageDiv);
		return;
	}
	if (price > 999.99) {
		showMessage(t('priceTooHigh'), 'error', messageDiv);
		return;
	}
	if (foods.some(food => food.name.toLowerCase() === name.toLowerCase())) {
		showMessage(t('duplicateFood'), 'error', messageDiv);
		return;
	}

	foods.push({ name, description, price, emoji });
	saveFoodsToStorage();

	document.getElementById('food-name').value = '';
	// no description field
	document.getElementById('food-price').value = '';
	document.getElementById('food-emoji').value = '';

	updateFoodsGrid();
	updateManageFoodsList();

	showMessage(t('addSuccess').replace('{name}', name), 'success', messageDiv);
}

function deleteDrink(index) {
	const drinkName = drinks[index].name;
	
	if (confirm(t('confirmDelete').replace('{name}', drinkName))) {
		drinks.splice(index, 1);
		updateDrinksGrid();
		updateManageDrinksList();
		saveDrinksToStorage();
		showMessage(t('deleteSuccess').replace('{name}', drinkName), 'success');
	}
}

function deleteFood(index) {
	const foodName = foods[index].name;
	if (confirm(t('confirmDelete').replace('{name}', foodName))) {
		foods.splice(index, 1);
		updateFoodsGrid();
		updateManageFoodsList();
		saveFoodsToStorage();
		showMessage(t('deleteSuccess').replace('{name}', foodName), 'success');
	}
}

function clearAllDrinks() {
	if (drinks.length === 0) return;
	if (!confirm(t('confirmClearAll'))) return;
	drinks = [];
	try {
		localStorage.removeItem(DRINKS_STORAGE_KEY);
	} catch (error) {
		console.warn('Failed to clear drinks from storage:', error);
	}
	updateDrinksGrid();
	updateManageDrinksList();
	showMessage(t('clearedAllSuccess'), 'success');
}

function clearAllFoods() {
	if (foods.length === 0) return;
	if (!confirm(t('confirmClearAllFoods'))) return;
	foods = [];
	try {
		localStorage.removeItem(FOODS_STORAGE_KEY);
	} catch (error) {
		console.warn('Failed to clear foods from storage:', error);
	}
	updateFoodsGrid();
	updateManageFoodsList();
	showMessage(t('clearedAllFoodsSuccess'), 'success');
}

function showMessage(text, type, targetEl) {
	const messageDiv = targetEl || document.getElementById('add-drink-message');
	if (!messageDiv) return;
	messageDiv.textContent = text;
	messageDiv.className = `message ${type}`;
	messageDiv.style.display = 'block';
	setTimeout(() => {
		messageDiv.style.display = 'none';
	}, 3000);
}

function toggleSidebar() {
	const sidebar = document.getElementById('sidebar');
	const overlay = document.getElementById('sidebar-overlay');
	
	if (sidebar.classList.contains('open')) {
		sidebar.classList.remove('open');
		overlay.classList.remove('open');
	} else {
		sidebar.classList.add('open');
		overlay.classList.add('open');
	}
}

function switchTab(tabName) {
	// Remove active class from all tabs and content
	document.querySelectorAll('.sidebar-tab').forEach(tab => tab.classList.remove('active'));
	document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
	
	// Add active class to clicked tab and corresponding content
	event.target.closest('.sidebar-tab').classList.add('active');
	document.getElementById(tabName + '-tab').classList.add('active');
	
	// Close sidebar after selecting a tab
	toggleSidebar();
}

function switchSubtab(name) {
	currentSubtab = name;
	const drinksBtn = document.getElementById('subtab-drinks-btn');
	const foodsBtn = document.getElementById('subtab-foods-btn');
	if (drinksBtn && foodsBtn) {
		if (name === 'drinks') {
			drinksBtn.classList.add('active');
			foodsBtn.classList.remove('active');
		} else {
			foodsBtn.classList.add('active');
			drinksBtn.classList.remove('active');
		}
	}
	const drinksGrid = document.getElementById('drinks-grid');
	const foodsGrid = document.getElementById('foods-grid');
	if (drinksGrid && foodsGrid) {
		drinksGrid.style.display = name === 'drinks' ? 'grid' : 'none';
		foodsGrid.style.display = name === 'foods' ? 'grid' : 'none';
	}
}

function addDrink(name, price) {
	if (currentOrder[name]) {
		currentOrder[name].quantity += 1;
	} else {
		currentOrder[name] = {
			price: price,
			quantity: 1
		};
	}
	updateCurrentOrder();
}

function updateQuantity(name, change) {
	if (currentOrder[name]) {
		currentOrder[name].quantity += change;
		if (currentOrder[name].quantity <= 0) {
			delete currentOrder[name];
		}
	}
	updateCurrentOrder();
}

function updateCurrentOrder() {
	const orderDiv = document.getElementById('current-order');
	const itemsDiv = document.getElementById('order-items');
	const totalDiv = document.getElementById('total');
	
	const items = Object.keys(currentOrder);
	
	if (items.length === 0) {
		orderDiv.style.display = 'none';
		return;
	}
	
	orderDiv.style.display = 'block';
	
	let itemsHTML = '';
	let total = 0;
	
	items.forEach(item => {
		const itemData = currentOrder[item];
		const itemTotal = itemData.price * itemData.quantity;
		total += itemTotal;
		
		itemsHTML += `
			<div class="order-item">
				<div>
					<strong>${item}</strong><br>
					<small>€${itemData.price.toFixed(2)} ${t('each')}</small>
				</div>
				<div class="quantity-controls">
					<button class="qty-btn" onclick="updateQuantity('${item}', -1)">-</button>
					<span style="margin: 0 10px; font-weight: bold;">${itemData.quantity}</span>
					<button class="qty-btn plus" onclick="updateQuantity('${item}', 1)">+</button>
				</div>
			</div>
		`;
	});
	
	itemsDiv.innerHTML = itemsHTML;
	totalDiv.innerHTML = `${t('totalLabel')}: €${total.toFixed(2)}`;
}

function completeOrder() {
	if (Object.keys(currentOrder).length === 0) return;
	
	const orderTotal = Object.keys(currentOrder).reduce((total, item) => {
		return total + (currentOrder[item].price * currentOrder[item].quantity);
	}, 0);
	
	// Get table number (optional)
	const tableNumberInput = document.getElementById('table-number');
	const tableNumber = tableNumberInput ? parseInt(tableNumberInput.value) : null;
	
	const order = {
		id: orderCounter++,
		items: {...currentOrder},
		total: orderTotal,
		timestamp: new Date(),
		tableNumber: tableNumber
	};
	
	orderHistory.unshift(order);
	currentOrder = {};
	
	// Clear table number input
	if (tableNumberInput) {
		tableNumberInput.value = '';
	}
	
	updateCurrentOrder();
	updateOrderHistory();
	saveOrderHistoryToStorage();
	
	// Show success feedback
	const doneBtn = document.getElementById('done-btn');
	const originalText = t('orderCompleteBtn') + ' ✅';
	doneBtn.textContent = t('orderDelivered') + ' 🎉';
	doneBtn.style.background = '#4CAF50';
	
	setTimeout(() => {
		doneBtn.textContent = originalText;
		doneBtn.style.background = 'linear-gradient(135deg, #FF6B6B, #FF8E53)';
	}, 2000);
}

function updateOrderHistory() {
	const historyDiv = document.getElementById('orders-history');
	
	if (orderHistory.length === 0) {
		historyDiv.innerHTML = `
			<div class="empty-state">
				<div class="empty-state-icon">📋</div>
				<h3>${t('historyEmptyTitle')}</h3>
				<p>${t('historyEmptyDesc')}</p>
			</div>
		`;
		return;
	}
	
	// Calculate totals
	const totalOrders = orderHistory.length;
	const totalAmount = orderHistory.reduce((sum, order) => sum + order.total, 0);
	
	let historyHTML = `
		<div class="history-summary">
			<div class="summary-item">
				<span class="summary-label">${t('totalOrders') || 'Total Orders'}:</span>
				<span class="summary-value">${totalOrders}</span>
			</div>
			<div class="summary-item">
				<span class="summary-label">${t('totalAmount') || 'Total Amount'}:</span>
				<span class="summary-value">€${totalAmount.toFixed(2)}</span>
			</div>
		</div>
	`;
	
	orderHistory.forEach(order => {
		const locale = getLocale();
		const timeString = order.timestamp.toLocaleTimeString(locale, {hour: '2-digit', minute:'2-digit'});
		const dateString = order.timestamp.toLocaleDateString(locale);
		
		let itemsHTML = '';
		Object.keys(order.items).forEach(item => {
			const itemData = order.items[item];
			itemsHTML += `<div>${item} x${itemData.quantity} - €${(itemData.price * itemData.quantity).toFixed(2)}</div>`;
		});
		
		historyHTML += `
			<div class="order-card">
				<div class="order-header">
					<div class="order-number">${t('orderLabel')} #${order.id}</div>
					<div class="order-time">${timeString} - ${dateString}</div>
					<button class="remove-order-btn" onclick="removeOrder(${order.id})" title="${t('removeOrder') || 'Remove Order'}">✕</button>
				</div>
				${order.tableNumber ? `<div class="order-table">${t('tableLabel')}: ${order.tableNumber}</div>` : ''}
				<div class="order-items">
					${itemsHTML}
				</div>
				<div class="order-total">${t('totalLabel')}: €${order.total.toFixed(2)}</div>
			</div>
		`;
	});
	
	historyDiv.innerHTML = historyHTML;
}

function getLocale() {
	switch (currentLang) {
		case 'nl': return 'nl-NL';
		case 'fr': return 'fr-FR';
		default: return 'en-US';
	}
}

function removeOrder(orderId) {
	const orderIndex = orderHistory.findIndex(order => order.id === orderId);
	if (orderIndex === -1) return;
	
	const order = orderHistory[orderIndex];
	if (confirm(t('confirmRemoveOrder') || `Are you sure you want to remove Order #${orderId}?`)) {
		orderHistory.splice(orderIndex, 1);
		updateOrderHistory();
		saveOrderHistoryToStorage();
		showMessage(t('orderRemoved') || `Order #${orderId} removed successfully!`, 'success');
	}
}

function exportMenu() {
	const data = {
		version: 1,
		createdAt: new Date().toISOString(),
		lang: currentLang,
		drinks,
		foods
	};
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'menu.json';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function importMenuFromFile(event) {
	const file = event.target.files && event.target.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = () => {
		try {
			const parsed = JSON.parse(reader.result);
			if (!parsed || typeof parsed !== 'object') throw new Error('Invalid json');
			const newDrinks = Array.isArray(parsed.drinks) ? parsed.drinks : [];
			const newFoods = Array.isArray(parsed.foods) ? parsed.foods : [];
			drinks = sanitizeItems(newDrinks, '🥤');
			foods = sanitizeItems(newFoods, '🍽️');
			saveDrinksToStorage();
			saveFoodsToStorage();
			updateDrinksGrid();
			updateFoodsGrid();
			updateManageDrinksList();
			updateManageFoodsList();
			alert(t('importSuccess'));
		} catch (e) {
			console.warn('Import failed', e);
			alert(t('importInvalid'));
		} finally {
			event.target.value = '';
		}
	};
	reader.readAsText(file);
}

function sanitizeItems(items, defaultEmoji) {
	return items
		.filter(it => it && typeof it === 'object')
		.map(it => {
			const name = String(it.name || '').trim();
			const priceNum = parseFloat(it.price);
			return {
				name,
				description: '',
				price: isNaN(priceNum) || priceNum <= 0 ? 0.01 : Math.min(999.99, priceNum),
				emoji: String(it.emoji || defaultEmoji).slice(0, 8)
			};
		})
		.filter(it => it.name && it.price > 0);
}

async function loadDefaults() {
    console.log('Loading defaults...');
    try {
        // Try to fetch the menu file
        console.log('Fetching padel_party_menu.json...');
        const res = await fetch('padel_party_menu.json', { 
            cache: 'no-store',
            method: 'GET'
        });
        
        console.log('Response status:', res.status, res.statusText);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Menu data loaded:', data);
        
        const newDrinks = Array.isArray(data.drinks) ? data.drinks : [];
        const newFoods = Array.isArray(data.foods) ? data.foods : [];
        
        console.log(`Found ${newDrinks.length} drinks and ${newFoods.length} foods`);
        
        // Merge with de-dup by name (case-insensitive)
        const mergedDrinks = mergeItems(drinks, sanitizeItems(newDrinks, '🥤'));
        const mergedFoods = mergeItems(foods, sanitizeItems(newFoods, '🍽️'));
        
        drinks = mergedDrinks;
        foods = mergedFoods;
        
        saveDrinksToStorage();
        saveFoodsToStorage();
        updateDrinksGrid();
        updateFoodsGrid();
        updateManageDrinksList();
        updateManageFoodsList();
        
        console.log('Defaults loaded successfully');
        alert(t('defaultsLoaded') || 'Default menu loaded successfully!');
        
    } catch (e) {
        console.error('Load defaults failed:', e);
        
        // Check if this is a CORS/local file issue
        if (e.message.includes('Failed to fetch') || e.message.includes('CORS') || e.message.includes('file://')) {
            alert('Cannot load menu file when opening HTML directly. Please:\n\n1. Upload to GitHub and access via GitHub Pages, OR\n2. Use a local web server (like Live Server in VS Code), OR\n3. Click OK to load a basic default menu instead.');
            
            if (confirm('Would you like to load a basic default menu instead?')) {
                loadFallbackDefaults();
            }
        } else if (e.message.includes('404')) {
            alert('Menu file not found. Make sure padel_party_menu.json is in the same folder as index.html');
        } else {
            alert(`Failed to load menu: ${e.message}\n\nClick OK to load a basic default menu instead.`);
            if (confirm('Would you like to load a basic default menu instead?')) {
                loadFallbackDefaults();
            }
        }
    }
}

function loadFallbackDefaults() {
    console.log('Loading fallback defaults...');
    
    // Basic fallback menu
    const defaultDrinks = [
        { "name": "Cava (glas)", "description": "", "price": 5.0, "emoji": "🍾" },
    { "name": "Cava (fles)", "description": "", "price": 20.0, "emoji": "🍾" },
    { "name": "Witte Wijn (glas)", "description": "", "price": 3.75, "emoji": "🍷" },
    { "name": "Witte Wijn (fles)", "description": "", "price": 20.0, "emoji": "🍷" },
    { "name": "Rosé Wijn (glas)", "description": "", "price": 3.75, "emoji": "🍷" },
    { "name": "Rosé Wijn (fles)", "description": "", "price": 20.0, "emoji": "🍷" },
    { "name": "Aperol (glas) - 'van 't Vat'", "description": "", "price": 6.25, "emoji": "🍹" },
    { "name": "Virgin Aperol (glas) - 'van 't Vat'", "description": "", "price": 6.25, "emoji": "🥤" },
    { "name": "Pils (25cl)", "description": "", "price": 2.5, "emoji": "🍺" },
    { "name": "Omer", "description": "", "price": 3.75, "emoji": "🍺" },
    { "name": "Duvel", "description": "", "price": 3.75, "emoji": "🍺" },
    { "name": "Cristal 0.0%", "description": "", "price": 2.5, "emoji": "🍺" },
    { "name": "Desperados 0.0%", "description": "", "price": 3.75, "emoji": "🍺" },
    { "name": "Cola", "description": "", "price": 2.5, "emoji": "🥤" },
    { "name": "Cola Zero", "description": "", "price": 2.5, "emoji": "🥤" },
    { "name": "Tönnisteiner Citroen", "description": "", "price": 2.5, "emoji": "🥤" },
    { "name": "Tönnisteiner Orange", "description": "", "price": 2.5, "emoji": "🥤" },
    { "name": "Plat Water", "description": "", "price": 2.5, "emoji": "💧" },
    { "name": "Spuit Water", "description": "", "price": 2.5, "emoji": "💧" },
    { "name": "Aquarius", "description": "", "price": 2.5, "emoji": "🥤" },
    { "name": "Tonic", "description": "", "price": 2.5, "emoji": "🥤" },
    { "name": "Padelbal (Pompelmoes)", "description": "", "price": 3.75, "emoji": "🍊" },
    { "name": "Skibal (Appelsiensap)", "description": "", "price": 3.75, "emoji": "🍊" },
    { "name": "Flügel (2 cl)", "description": "", "price": 2.5, "emoji": "🥃" },
    { "name": "Jägermeister (2 cl)", "description": "", "price": 3.75, "emoji": "🥃" }
    ];
    
    const defaultFoods = [
        { "name": "Chips (paprika, pickels, pepper & salt)", "description": "", "price": 2.5, "emoji": "🍟" },
    { "name": "Portie Mini-Frikandel", "description": "", "price": 5.0, "emoji": "🥓" },
    { "name": "Portie Partymix", "description": "", "price": 5.0, "emoji": "🍴" },
    { "name": "Luxe Hamburger", "description": "Huisgemaakte hamburger van rund WIT-BLAUW met ijsbergsalade, tomaat en ui", "price": 10.0, "emoji": "🍔" },
    { "name": "Frietjes met snacks", "description": "Keuze uit frikandel, frikandel special, saté, mexicano, kipkorn, kaaskroket of boulet", "price": 10.0, "emoji": "🍟" }
    ];
    
    // Merge with existing items
    const mergedDrinks = mergeItems(drinks, sanitizeItems(defaultDrinks, '🥤'));
    const mergedFoods = mergeItems(foods, sanitizeItems(defaultFoods, '🍽️'));
    
    drinks = mergedDrinks;
    foods = mergedFoods;
    
    saveDrinksToStorage();
    saveFoodsToStorage();
    updateDrinksGrid();
    updateFoodsGrid();
    updateManageDrinksList();
    updateManageFoodsList();
    
    console.log('Fallback defaults loaded');
    alert('Basic default menu loaded successfully!');
}	

function mergeItems(existing, incoming) {
    const nameToItem = new Map();
    existing.forEach(it => nameToItem.set(it.name.toLowerCase(), it));
    incoming.forEach(it => {
        const key = it.name.toLowerCase();
        if (!nameToItem.has(key)) nameToItem.set(key, it);
    });
    return Array.from(nameToItem.values());
}


