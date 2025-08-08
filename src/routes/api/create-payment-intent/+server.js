// File: src/routes/api/create-payment-intent/+server.js
// API route for creating Stripe payment intents

import { json } from '@sveltejs/kit';
import { createPaymentIntent } from '$lib/stripe-server.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { amount, currency = 'usd', metadata = {} } = await request.json();

		// Validate required fields
		if (!amount || amount <= 0) {
			return json(
				{
					success: false,
					error: 'Invalid amount. Amount must be greater than 0.'
				},
				{ status: 400 }
			);
		}

		// Add additional metadata
		const enhancedMetadata = {
			...metadata,
			timestamp: new Date().toISOString(),
			source: 'somethings-brewing-web'
		};

		// Create payment intent
		const result = await createPaymentIntent({
			amount,
			currency,
			metadata: enhancedMetadata
		});

		if (result.success) {
			return json({
				success: true,
				clientSecret: result.clientSecret,
				paymentIntentId: result.paymentIntentId
			});
		} else {
			return json(
				{
					success: false,
					error: result.error
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Payment intent creation error:', error);
		return json(
			{
				success: false,
				error: 'Internal server error. Please try again.'
			},
			{ status: 500 }
		);
	}
}

// Handle preflight requests for CORS
/** @type {import('./$types').RequestHandler} */
export async function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
}
