// File: src/routes/api/orders/create/+server.js
// API route for creating orders and initiating payment

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';
import { sanitizeString } from '$lib/validation.js';
import { createPaymentIntent } from '$lib/stripe-server.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
    const body = await request.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const customer_id = sanitizeString(body?.customer_id || '');
    const affiliate_id = body?.affiliate_id ? sanitizeString(body.affiliate_id) : null;
    const shipping_address = body?.shipping_address ? sanitizeString(body.shipping_address, 2048) : null;

		// Validate required fields
		if (!items || !Array.isArray(items) || items.length === 0) {
			return json(
				{
					success: false,
					error: 'Items are required and must be a non-empty array.'
				},
				{ status: 400 }
			);
		}

		if (!customer_id) {
			return json(
				{
					success: false,
					error: 'Customer ID is required.'
				},
				{ status: 400 }
			);
		}

		// Calculate order total
		let totalPrice = 0;
		const orderItems = [];

		for (const item of items) {
      // Get product details from database
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price, available, stock')
        .eq('id', item.product_id)
        .single();

			if (productError || !product) {
				return json(
					{
						success: false,
						error: `Product not found: ${item.product_id}`
					},
					{ status: 400 }
				);
			}

			if (!product.available) {
				return json(
					{
						success: false,
						error: `Product not available: ${product.name}`
					},
					{ status: 400 }
				);
			}

      // Check stock if tracked
      if (typeof product.stock === 'number' && product.stock < item.quantity) {
        return json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = Number(product.price) * Number(item.quantity);
			totalPrice += itemTotal;

			orderItems.push({
				product_id: product.id,
				quantity: item.quantity,
				unit_price: product.price
			});
		}

		// Create order in database
		const { data: order, error: orderError } = await supabase
			.from('orders')
			.insert({
				customer_id,
				affiliate_id,
				total_price: totalPrice,
				status: 'pending'
			})
			.select()
			.single();

		if (orderError) {
			console.error('Error creating order:', orderError);
			return json(
				{
					success: false,
					error: 'Failed to create order.'
				},
				{ status: 500 }
			);
		}

		// Create order items
		const orderItemsWithOrderId = orderItems.map((item) => ({
			...item,
			order_id: order.id
		}));

		const { error: itemsError } = await supabase.from('order_items').insert(orderItemsWithOrderId);

		if (itemsError) {
			console.error('Error creating order items:', itemsError);
			// Rollback order creation
			await supabase.from('orders').delete().eq('id', order.id);
			return json(
				{
					success: false,
					error: 'Failed to create order items.'
				},
				{ status: 500 }
			);
		}

    // Create payment intent
    const paymentResult = await createPaymentIntent({
			amount: totalPrice,
			currency: 'usd',
			metadata: {
        order_id: order.id,
        customer_id: customer_id,
				affiliate_id: affiliate_id || '',
				item_count: items.length
			}
		});

		if (!paymentResult.success) {
			// Rollback order creation
			await supabase.from('order_items').delete().eq('order_id', order.id);
			await supabase.from('orders').delete().eq('id', order.id);

			return json(
				{
					success: false,
					error: 'Failed to create payment intent.'
				},
				{ status: 500 }
			);
		}

    // Reserve stock by decrementing product stock (optimistic reservation)
    // This prevents overselling between intent and capture; if payment fails, webhook will not restock, so for real systems consider softer reservations.
    for (const oi of orderItemsWithOrderId) {
      await supabase.rpc('decrement_product_stock', { p_id: oi.product_id, qty: oi.quantity });
    }

		return json({
			success: true,
			order: {
				id: order.id,
				total_price: totalPrice,
				status: order.status,
				created_at: order.created_at
			},
			payment: {
				client_secret: paymentResult.clientSecret,
				payment_intent_id: paymentResult.paymentIntentId
			}
		});
	} catch (error) {
		console.error('Order creation error:', error);
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
