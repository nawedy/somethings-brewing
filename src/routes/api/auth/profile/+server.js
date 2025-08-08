// File: src/routes/api/auth/profile/+server.js
// API route for user profile management (CRUD operations)

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	try {
		const authHeader = request.headers.get('authorization');
		if (!authHeader) {
			return json(
				{
					success: false,
					error: 'Authorization required'
				},
				{ status: 401 }
			);
		}

		// Get user from Supabase auth
		const {
			data: { user },
			error: authError
		} = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

		if (authError || !user) {
			return json(
				{
					success: false,
					error: 'Invalid or expired token'
				},
				{ status: 401 }
			);
		}

		// Get customer profile from database
		const { data: customer, error: customerError } = await supabase
			.from('customers')
			.select('*')
			.eq('id', user.id)
			.single();

		if (customerError || !customer) {
			return json(
				{
					success: false,
					error: 'Profile not found'
				},
				{ status: 404 }
			);
		}

		return json({
			success: true,
			profile: {
				id: customer.id,
				email: customer.email,
				full_name: customer.full_name,
				phone: customer.phone,
				is_affiliate: customer.is_affiliate,
				role: customer.role,
				last_login_at: customer.last_login_at,
				created_at: customer.created_at,
				updated_at: customer.updated_at,
				email_verified: user.email_confirmed_at !== null
			}
		});
	} catch (error) {
		console.error('Error fetching profile:', error);
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
export async function PUT({ request }) {
	try {
		const authHeader = request.headers.get('authorization');
		if (!authHeader) {
			return json(
				{
					success: false,
					error: 'Authorization required'
				},
				{ status: 401 }
			);
		}

		// Get user from Supabase auth
		const {
			data: { user },
			error: authError
		} = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

		if (authError || !user) {
			return json(
				{
					success: false,
					error: 'Invalid or expired token'
				},
				{ status: 401 }
			);
		}

		const { full_name, phone, email } = await request.json();

		// Validate input
		if (full_name && typeof full_name !== 'string') {
			return json(
				{
					success: false,
					error: 'Full name must be a string'
				},
				{ status: 400 }
			);
		}

		if (phone && typeof phone !== 'string') {
			return json(
				{
					success: false,
					error: 'Phone must be a string'
				},
				{ status: 400 }
			);
		}

		if (email && typeof email !== 'string') {
			return json(
				{
					success: false,
					error: 'Email must be a string'
				},
				{ status: 400 }
			);
		}

		// Validate email format if provided
		if (email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return json(
					{
						success: false,
						error: 'Please enter a valid email address'
					},
					{ status: 400 }
				);
			}

			// Check if email is already taken by another user
			if (email !== user.email) {
				const { data: existingUser } = await supabase
					.from('customers')
					.select('id')
					.eq('email', email)
					.neq('id', user.id)
					.single();

				if (existingUser) {
					return json(
						{
							success: false,
							error: 'This email address is already in use'
						},
						{ status: 409 }
					);
				}
			}
		}

		// Prepare update data
		const updateData = {
			updated_at: new Date().toISOString()
		};

		if (full_name !== undefined) updateData.full_name = full_name;
		if (phone !== undefined) updateData.phone = phone;
		if (email !== undefined && email !== user.email) updateData.email = email;

		// Update customer profile
		const { data: updatedCustomer, error: updateError } = await supabase
			.from('customers')
			.update(updateData)
			.eq('id', user.id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating customer profile:', updateError);
			return json(
				{
					success: false,
					error: 'Failed to update profile'
				},
				{ status: 500 }
			);
		}

		// If email was changed, update Supabase auth user
		if (email && email !== user.email) {
			const { error: authUpdateError } = await supabase.auth.updateUser({
				email: email
			});

			if (authUpdateError) {
				console.error('Error updating auth user email:', authUpdateError);
				// Rollback customer email change
				await supabase.from('customers').update({ email: user.email }).eq('id', user.id);

				return json(
					{
						success: false,
						error: 'Failed to update email address. Please try again.'
					},
					{ status: 500 }
				);
			}
		}

		return json({
			success: true,
			message: 'Profile updated successfully',
			profile: {
				id: updatedCustomer.id,
				email: updatedCustomer.email,
				full_name: updatedCustomer.full_name,
				phone: updatedCustomer.phone,
				is_affiliate: updatedCustomer.is_affiliate,
				role: updatedCustomer.role,
				updated_at: updatedCustomer.updated_at
			}
		});
	} catch (error) {
		console.error('Error updating profile:', error);
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
export async function DELETE({ request }) {
	try {
		const authHeader = request.headers.get('authorization');
		if (!authHeader) {
			return json(
				{
					success: false,
					error: 'Authorization required'
				},
				{ status: 401 }
			);
		}

		// Get user from Supabase auth
		const {
			data: { user },
			error: authError
		} = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

		if (authError || !user) {
			return json(
				{
					success: false,
					error: 'Invalid or expired token'
				},
				{ status: 401 }
			);
		}

		// Check if user has any pending orders
		const { data: pendingOrders } = await supabase
			.from('orders')
			.select('id')
			.eq('customer_id', user.id)
			.in('status', ['pending', 'paid', 'processing', 'shipped']);

		if (pendingOrders && pendingOrders.length > 0) {
			return json(
				{
					success: false,
					error: 'Cannot delete account with pending orders. Please contact support.'
				},
				{ status: 400 }
			);
		}

		// Soft delete - mark customer as deleted but keep for audit trail
		const { error: softDeleteError } = await supabase
			.from('customers')
			.update({
				email: `deleted_${user.id}@deleted.com`,
				full_name: '[DELETED]',
				phone: null,
				deleted_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.eq('id', user.id);

		if (softDeleteError) {
			console.error('Error soft deleting customer:', softDeleteError);
			return json(
				{
					success: false,
					error: 'Failed to delete account'
				},
				{ status: 500 }
			);
		}

		// Delete Supabase auth user
		const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);

		if (authDeleteError) {
			console.error('Error deleting auth user:', authDeleteError);
			// Note: Customer record is already soft deleted, which is acceptable
		}

		return json({
			success: true,
			message: 'Account deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting account:', error);
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
			'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
}
