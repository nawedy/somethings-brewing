// File: src/routes/api/orders/[id]/tracking/+server.js
// API route for managing order tracking information

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	try {
		const orderId = params.id;

		if (!orderId) {
			return json(
				{
					success: false,
					error: 'Order ID is required'
				},
				{ status: 400 }
			);
		}

		// Get tracking information for the order
		const { data: tracking, error: trackingError } = await supabase
			.from('order_tracking')
			.select('*')
			.eq('order_id', orderId)
			.order('created_at', { ascending: true });

		if (trackingError) {
			console.error('Error fetching tracking:', trackingError);
			return json(
				{
					success: false,
					error: 'Failed to fetch tracking information'
				},
				{ status: 500 }
			);
		}

		// Get current order status
		const { data: order, error: orderError } = await supabase
			.from('orders')
			.select('status, tracking_number, shipping_carrier')
			.eq('id', orderId)
			.single();

		if (orderError) {
			console.error('Error fetching order:', orderError);
			return json(
				{
					success: false,
					error: 'Order not found'
				},
				{ status: 404 }
			);
		}

		return json({
			success: true,
			tracking: {
				current_status: order.status,
				tracking_number: order.tracking_number,
				shipping_carrier: order.shipping_carrier,
				history: tracking
			}
		});
	} catch (error) {
		console.error('Error fetching tracking:', error);
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
export async function POST({ params, request }) {
	try {
		const orderId = params.id;
		const { status, notes, tracking_number, shipping_carrier, location } = await request.json();

		if (!orderId || !status) {
			return json(
				{
					success: false,
					error: 'Order ID and status are required'
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
			'in_transit',
			'out_for_delivery',
			'delivered',
			'cancelled',
			'payment_failed'
		];

		if (!validStatuses.includes(status)) {
			return json(
				{
					success: false,
					error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
				},
				{ status: 400 }
			);
		}

		// Check if order exists
		const { data: order, error: orderError } = await supabase
			.from('orders')
			.select('id')
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

		// Create tracking entry
		const { data: trackingEntry, error: trackingError } = await supabase
			.from('order_tracking')
			.insert({
				order_id: orderId,
				status: status,
				notes: notes || null,
				tracking_number: tracking_number || null,
				shipping_carrier: shipping_carrier || null,
				location: location || null
			})
			.select()
			.single();

		if (trackingError) {
			console.error('Error creating tracking entry:', trackingError);
			return json(
				{
					success: false,
					error: 'Failed to create tracking entry'
				},
				{ status: 500 }
			);
		}

		// Update order status and tracking info
		const updateData = {
			status: status,
			updated_at: new Date().toISOString()
		};

		if (tracking_number) updateData.tracking_number = tracking_number;
		if (shipping_carrier) updateData.shipping_carrier = shipping_carrier;

		const { error: orderUpdateError } = await supabase
			.from('orders')
			.update(updateData)
			.eq('id', orderId);

		if (orderUpdateError) {
			console.error('Error updating order:', orderUpdateError);
		}

		return json({
			success: true,
			tracking_entry: trackingEntry
		});
	} catch (error) {
		console.error('Error creating tracking entry:', error);
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
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
}
