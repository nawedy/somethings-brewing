// File: src/lib/stripe-server.js
// Server-side Stripe configuration and utilities

import Stripe from 'stripe';

// Get Stripe secret key from environment
const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
	console.warn('Stripe secret key not found. Server-side payment functionality will be limited.');
}

// Initialize Stripe with secret key
export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
	apiVersion: '2025-07-30.basil'
});

// Create payment intent
export const createPaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(amount * 100), // Convert to cents
			currency,
			automatic_payment_methods: {
				enabled: true
			},
			metadata: {
				...metadata,
				source: 'somethings-brewing'
			}
		});

		return {
			success: true,
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id
		};
	} catch (error) {
		console.error('Error creating payment intent:', error);
		return {
			success: false,
			error: error.message
		};
	}
};

// Create customer
export const createStripeCustomer = async ({ email, name, metadata = {} }) => {
	try {
		const customer = await stripe.customers.create({
			email,
			name,
			metadata: {
				...metadata,
				source: 'somethings-brewing'
			}
		});

		return {
			success: true,
			customerId: customer.id,
			customer
		};
	} catch (error) {
		console.error('Error creating Stripe customer:', error);
		return {
			success: false,
			error: error.message
		};
	}
};

// Retrieve customer
export const getStripeCustomer = async (customerId) => {
	try {
		const customer = await stripe.customers.retrieve(customerId);
		return {
			success: true,
			customer
		};
	} catch (error) {
		console.error('Error retrieving Stripe customer:', error);
		return {
			success: false,
			error: error.message
		};
	}
};

// Create product
export const createStripeProduct = async ({ name, description, metadata = {} }) => {
	try {
		const product = await stripe.products.create({
			name,
			description,
			metadata: {
				...metadata,
				source: 'somethings-brewing'
			}
		});

		return {
			success: true,
			productId: product.id,
			product
		};
	} catch (error) {
		console.error('Error creating Stripe product:', error);
		return {
			success: false,
			error: error.message
		};
	}
};

// Create price for product
export const createStripePrice = async ({
	productId,
	amount,
	currency = 'usd',
	recurring = null
}) => {
	try {
		const priceData = {
			product: productId,
			unit_amount: Math.round(amount * 100), // Convert to cents
			currency,
			metadata: {
				source: 'somethings-brewing'
			}
		};

		if (recurring) {
			priceData.recurring = recurring; // e.g., { interval: 'month' }
		}

		const price = await stripe.prices.create(priceData);

		return {
			success: true,
			priceId: price.id,
			price
		};
	} catch (error) {
		console.error('Error creating Stripe price:', error);
		return {
			success: false,
			error: error.message
		};
	}
};

// Handle webhook events
export const handleWebhookEvent = async (event) => {
	try {
		switch (event.type) {
			case 'payment_intent.succeeded':
				// Handle successful payment
				console.log('Payment succeeded:', event.data.object.id);
				// TODO: Update order status in database
				break;

			case 'payment_intent.payment_failed':
				// Handle failed payment
				console.log('Payment failed:', event.data.object.id);
				// TODO: Update order status and notify customer
				break;

			case 'customer.created':
				// Handle new customer creation
				console.log('Customer created:', event.data.object.id);
				break;

			case 'invoice.payment_succeeded':
				// Handle successful subscription payment
				console.log('Subscription payment succeeded:', event.data.object.id);
				break;

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return { success: true };
	} catch (error) {
		console.error('Error handling webhook event:', error);
		return { success: false, error: error.message };
	}
};

// Verify webhook signature
export const verifyWebhookSignature = (payload, signature) => {
	try {
		const event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);
		return { verified: true, event };
	} catch (error) {
		console.error('Webhook signature verification failed:', error);
		return { verified: false, error: error.message };
	}
};

// Refund payment
export const refundPayment = async (paymentIntentId, amount = null) => {
	try {
		const refundData = {
			payment_intent: paymentIntentId
		};

		if (amount) {
			refundData.amount = Math.round(amount * 100); // Convert to cents
		}

		const refund = await stripe.refunds.create(refundData);

		return {
			success: true,
			refundId: refund.id,
			refund
		};
	} catch (error) {
		console.error('Error creating refund:', error);
		return {
			success: false,
			error: error.message
		};
	}
};
