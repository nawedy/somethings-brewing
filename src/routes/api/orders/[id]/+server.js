// File: src/routes/api/orders/[id]/+server.js
// API route for retrieving order details and tracking information

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
	try {
		const orderId = params.id;
		const includeTracking = url.searchParams.get('include_tracking') === 'true';

		if (!orderId) {
			return json(
				{
					success: false,
					error: 'Order ID is required'
				},
				{ status: 400 }
			);
		}

		// Get order details with customer and items
		const { data: order, error: orderError } = await supabase
			.from('orders')
			.select(
				`
				*,
				customers (
					id,
					email,
					full_name
				),
				order_items (
					id,
					quantity,
					unit_price,
					products (
						id,
						name,
						description,
						image_url,
						slug
					)
				)
			`
			)
			.eq('id', orderId)
			.single();

		if (orderError || !order) {
			return json(
				{
					success: false,
					error: 'Order not found'
				},
				{ status: 404 }
			);
		}

		let tracking = null;
		if (includeTracking) {
			// Get order tracking information
			const { data: trackingData, error: trackingError } = await supabase
				.from('order_tracking')
				.select('*')
				.eq('order_id', orderId)
				.order('created_at', { ascending: true });

			if (!trackingError) {
				tracking = trackingData;
			}
		}

		// Calculate order summary
		const itemCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
		const subtotal = order.order_items.reduce(
			(sum, item) => sum + item.quantity * item.unit_price,
			0
		);

		return json({
			success: true,
			order: {
				id: order.id,
				status: order.status,
				total_price: order.total_price,
				created_at: order.created_at,
				updated_at: order.updated_at,
				customer: order.customers,
				items: order.order_items,
				summary: {
					item_count: itemCount,
					subtotal: subtotal,
					shipping: 0, // TODO: Calculate shipping
					tax: 0, // TODO: Calculate tax
					total: order.total_price
				},
				tracking: tracking
			}
		});
	} catch (error) {
		console.error('Error fetching order:', error);
		return json(
			{
				success: false,
				error: 'Internal server error'
			},
			{ status: 500 }
		);
	}
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request }) {
	try {
		const orderId = params.id;
		const { status, tracking_number, shipping_carrier, notes } = await request.json();

		if (!orderId) {
			return json(
				{
					success: false,
					error: 'Order ID is required'
				},
				{ status: 400 }
			);
		}

		// Validate status
		const validStatuses = [
			'pending',
			'paid',
			'processing',
			'shipped',
			'delivered',
			'cancelled',
			'payment_failed'
		];

		if (status && !validStatuses.includes(status)) {
			return json(
				{
					success: false,
					error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
				},
				{ status: 400 }
			);
		}

		// Update order
		const updateData = {
			updated_at: new Date().toISOString()
		};

		if (status) updateData.status = status;
		if (tracking_number) updateData.tracking_number = tracking_number;
		if (shipping_carrier) updateData.shipping_carrier = shipping_carrier;

		const { data: order, error: orderError } = await supabase
			.from('orders')
			.update(updateData)
			.eq('id', orderId)
			.select()
			.single();

		if (orderError) {
			console.error('Error updating order:', orderError);
			return json(
				{
					success: false,
					error: 'Failed to update order'
				},
				{ status: 500 }
			);
		}

		// Add tracking entry if status changed
		if (status) {
			const { error: trackingError } = await supabase.from('order_tracking').insert({
				order_id: orderId,
				status: status,
				notes: notes || null,
				tracking_number: tracking_number || null,
				shipping_carrier: shipping_carrier || null
			});

			if (trackingError) {
				console.error('Error creating tracking entry:', trackingError);
			}
		}

		return json({
			success: true,
			order: order
		});
	} catch (error) {
		console.error('Error updating order:', error);
		return json(
			{
				success: false,
				error: 'Internal server error'
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
			'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
}
