// File: src/lib/stripe.js
// Stripe client configuration and utilities

import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment
const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
	console.warn('Stripe publishable key not found. Payment functionality will be limited.');
}

// Initialize Stripe instance
let stripePromise;
export const getStripe = () => {
	if (!stripePromise) {
		stripePromise = loadStripe(stripePublishableKey || 'pk_test_placeholder');
	}
	return stripePromise;
};

// Stripe configuration constants
export const STRIPE_CONFIG = {
	currency: 'usd',
	country: 'US',
	supportedPaymentMethods: ['card', 'apple_pay', 'google_pay'],
	captureMethod: 'automatic',
	confirmationMethod: 'automatic'
};

// Product price formatting utility
export const formatPrice = (amount, currency = 'USD') => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2
	}).format(amount / 100); // Stripe uses cents
};

// Convert dollar amount to cents for Stripe
export const toCents = (dollarAmount) => {
	return Math.round(dollarAmount * 100);
};

// Convert cents to dollar amount from Stripe
export const fromCents = (centsAmount) => {
	return centsAmount / 100;
};

// Stripe error handling utility
export const handleStripeError = (error) => {
	console.error('Stripe error:', error);

	switch (error.type) {
		case 'card_error':
			return {
				type: 'card_error',
				message: error.message || 'Your card was declined.',
				code: error.code
			};
		case 'validation_error':
			return {
				type: 'validation_error',
				message: error.message || 'Invalid payment information.',
				code: error.code
			};
		case 'api_error':
			return {
				type: 'api_error',
				message: 'Payment processing error. Please try again.',
				code: error.code
			};
		default:
			return {
				type: 'unknown_error',
				message: 'An unexpected error occurred. Please try again.',
				code: 'unknown'
			};
	}
};

// Webhook signature verification utility
export const verifyWebhookSignature = (payload, signature, secret) => {
	// This would be used in server-side webhook handling
	// Implementation depends on server framework
	return {
		verified: true, // Placeholder
		event: null
	};
};
