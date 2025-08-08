// File: src/lib/stores/cart.js
// Centralized cart state management with persistence

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Cart item structure: { id, name, price, quantity, image_url }
const createCartStore = () => {
	const { subscribe, set, update } = writable([]);

	// Load cart from localStorage on initialization
	const loadCart = () => {
		if (browser) {
			try {
				const stored = localStorage.getItem('cart');
				if (stored) {
					const cartData = JSON.parse(stored);
					set(cartData);
				}
			} catch (error) {
				console.error('Error loading cart from localStorage:', error);
				set([]);
			}
		}
	};

	// Save cart to localStorage
	const saveCart = (cartItems) => {
		if (browser) {
			try {
				localStorage.setItem('cart', JSON.stringify(cartItems));
			} catch (error) {
				console.error('Error saving cart to localStorage:', error);
			}
		}
	};

	return {
		subscribe,
		// Initialize cart
		init: loadCart,
        // Add item to cart
        addItem: (product) => {
			update((items) => {
				const existingItem = items.find((item) => item.id === product.id);
				if (existingItem) {
					// Update quantity if item already exists
					const updatedItems = items.map((item) =>
						item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
					);
					saveCart(updatedItems);
					return updatedItems;
				} else {
					// Add new item
              const normalizedPrice = typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price;
              const updatedItems = [...items, { ...product, price: normalizedPrice, quantity: 1 }];
					saveCart(updatedItems);
					return updatedItems;
				}
			});
		},
		// Remove item from cart
		removeItem: (productId) => {
			update((items) => {
				const updatedItems = items.filter((item) => item.id !== productId);
				saveCart(updatedItems);
				return updatedItems;
			});
		},
		// Update item quantity
		updateQuantity: (productId, quantity) => {
			if (quantity <= 0) {
				// Remove item if quantity is 0 or negative
				update((items) => {
					const updatedItems = items.filter((item) => item.id !== productId);
					saveCart(updatedItems);
					return updatedItems;
				});
			} else {
				update((items) => {
					const updatedItems = items.map((item) =>
						item.id === productId ? { ...item, quantity } : item
					);
					saveCart(updatedItems);
					return updatedItems;
				});
			}
		},
		// Clear entire cart
		clear: () => {
			set([]);
			if (browser) {
				localStorage.removeItem('cart');
			}
		},
		// Get cart total
		getTotal: (items) => {
			return items.reduce((total, item) => total + item.price * item.quantity, 0);
		},
		// Get cart item count
		getItemCount: (items) => {
			return items.reduce((count, item) => count + item.quantity, 0);
		}
	};
};

export const cart = createCartStore();

// Derived store for cart total
import { derived } from 'svelte/store';
export const cartTotal = derived(cart, ($cart) => cart.getTotal($cart));
export const cartItemCount = derived(cart, ($cart) => cart.getItemCount($cart));
