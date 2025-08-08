// File: src/routes/api/orders/+server.js
// API route for listing and filtering orders

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const customerId = url.searchParams.get('customer_id');
		const status = url.searchParams.get('status');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const sortBy = url.searchParams.get('sort_by') || 'created_at';
		const sortOrder = url.searchParams.get('sort_order') || 'desc';

		// Build query
		let query = supabase.from('orders').select(
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
					image_url,
					slug
				)
			)
		`,
			{ count: 'exact' }
		);

		// Apply filters
		if (customerId) {
			query = query.eq('customer_id', customerId);
		}

		if (status) {
			query = query.eq('status', status);
		}

		// Apply sorting
		const ascending = sortOrder === 'asc';
		query = query.order(sortBy, { ascending });

		// Apply pagination
		const from = (page - 1) * limit;
		const to = from + limit - 1;
		query = query.range(from, to);

		const { data: orders, error: ordersError, count } = await query;

		if (ordersError) {
			console.error('Error fetching orders:', ordersError);
			return json(
				{
					success: false,
					error: 'Failed to fetch orders'
				},
				{ status: 500 }
			);
		}

		// Calculate summary for each order
		const ordersWithSummary = orders.map((order) => {
			const itemCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
			const subtotal = order.order_items.reduce(
				(sum, item) => sum + item.quantity * item.unit_price,
				0
			);

			return {
				...order,
				summary: {
					item_count: itemCount,
					subtotal: subtotal,
					shipping: 0, // TODO: Calculate shipping
					tax: 0, // TODO: Calculate tax
					total: order.total_price
				}
			};
		});

		// Calculate pagination info
		const totalPages = Math.ceil(count / limit);
		const hasNext = page < totalPages;
		const hasPrev = page > 1;

		return json({
			success: true,
			orders: ordersWithSummary,
			pagination: {
				page,
				limit,
				total: count,
				total_pages: totalPages,
				has_next: hasNext,
				has_prev: hasPrev
			}
		});
	} catch (error) {
		console.error('Error fetching orders:', error);
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
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
}
