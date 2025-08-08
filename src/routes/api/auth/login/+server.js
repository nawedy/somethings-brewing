// File: src/routes/api/auth/login/+server.js
// API route for user login with customer data retrieval

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';
import { isValidEmail, sanitizeString } from '$lib/validation.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
    const payload = await request.json();
    const email = sanitizeString(payload?.email || '');
    const password = String(payload?.password || '');

		// Validate required fields
    if (!email || !password) {
			return json(
				{
					success: false,
					error: 'Email and password are required'
				},
				{ status: 400 }
			);
		}

    if (!isValidEmail(email)) {
      return json({ success: false, error: 'Please enter a valid email address' }, { status: 400 });
    }

		// Attempt to sign in with Supabase
		const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (authError) {
			console.error('Login error:', authError);

			// Provide user-friendly error messages
			let errorMessage = 'Login failed. Please try again.';

			if (authError.message.includes('Invalid login credentials')) {
				errorMessage = 'Invalid email or password. Please check your credentials and try again.';
			} else if (authError.message.includes('Email not confirmed')) {
				errorMessage =
					'Please verify your email address before logging in. Check your inbox for a verification link.';
			} else if (authError.message.includes('Too many requests')) {
				errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
			}

			return json(
				{
					success: false,
					error: errorMessage
				},
				{ status: 401 }
			);
		}

		if (!authData.user) {
			return json(
				{
					success: false,
					error: 'Login failed. Please try again.'
				},
				{ status: 401 }
			);
		}

		// Get customer record from database
		const { data: customer, error: customerError } = await supabase
			.from('customers')
			.select('*')
			.eq('id', authData.user.id)
			.single();

		if (customerError || !customer) {
			console.error('Error fetching customer record:', customerError);

			// If customer record doesn't exist, create it
			// This handles cases where users were created directly in Supabase auth
			const { error: createError } = await supabase.from('customers').insert({
				id: authData.user.id,
				email: authData.user.email,
				full_name: authData.user.user_metadata?.full_name || null,
				phone: authData.user.user_metadata?.phone || null,
				is_affiliate: false,
				role: 'customer'
			});

			if (createError) {
				console.error('Error creating missing customer record:', createError);
			}

			// Fetch the newly created record
			const { data: newCustomer } = await supabase
				.from('customers')
				.select('*')
				.eq('id', authData.user.id)
				.single();

			return json({
				success: true,
				message: 'Login successful',
				user: {
					id: authData.user.id,
					email: authData.user.email,
					full_name: newCustomer?.full_name || authData.user.user_metadata?.full_name,
					phone: newCustomer?.phone || authData.user.user_metadata?.phone,
					role: newCustomer?.role || 'customer',
					is_affiliate: newCustomer?.is_affiliate || false,
					email_verified: authData.user.email_confirmed_at !== null
				},
				session: authData.session
			});
		}

		// Update last login timestamp
		await supabase
			.from('customers')
			.update({
				last_login_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.eq('id', authData.user.id);

		return json({
			success: true,
			message: 'Login successful',
			user: {
				id: customer.id,
				email: customer.email,
				full_name: customer.full_name,
				phone: customer.phone,
				role: customer.role,
				is_affiliate: customer.is_affiliate,
				email_verified: authData.user.email_confirmed_at !== null,
				created_at: customer.created_at
			},
			session: authData.session
		});
	} catch (error) {
		console.error('Login error:', error);
		return json(
			{
				success: false,
				error: 'Internal server error. Please try again later.'
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
