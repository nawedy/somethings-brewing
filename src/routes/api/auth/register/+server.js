// File: src/routes/api/auth/register/+server.js
// API route for user registration with customer record creation

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';
import { isValidEmail, sanitizeString } from '$lib/validation.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
    const body = await request.json();
    const email = sanitizeString(body?.email || '');
    const password = String(body?.password || '');
    const fullName = sanitizeString(body?.fullName || '', 128);
    const phone = sanitizeString(body?.phone || '', 32);

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

		// Validate password strength
		if (password.length < 6) {
			return json(
				{
					success: false,
					error: 'Password must be at least 6 characters long'
				},
				{ status: 400 }
			);
		}

		// Validate email format
    if (!isValidEmail(email)) {
			return json(
				{
					success: false,
					error: 'Please enter a valid email address'
				},
				{ status: 400 }
			);
		}

		// Check if user already exists
		const { data: existingUser } = await supabase
			.from('customers')
			.select('email')
			.eq('email', email)
			.single();

		if (existingUser) {
			return json(
				{
					success: false,
					error: 'An account with this email already exists'
				},
				{ status: 409 }
			);
		}


		// Compute email verification redirect URL
		const origin = new URL(request.url).origin;
		const emailRedirectTo = `${origin}/auth/callback`;

		// Create Supabase auth user with email verification redirect
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo,
				data: {
					full_name: fullName,
					phone: phone
				}
			}
		});

		if (authError) {
			console.error('Supabase auth error:', authError);
			return json(
				{
					success: false,
					error: authError.message
				},
				{ status: 400 }
			);
		}

		// Create customer record in database
		if (authData.user) {
			const { error: customerError } = await supabase.from('customers').insert({
				id: authData.user.id,
				email: email,
				full_name: fullName || null,
				phone: phone || null,
				is_affiliate: false,
				role: 'customer'
			});

			if (customerError) {
				console.error('Error creating customer record:', customerError);

				// If customer creation fails, we should clean up the auth user
				// Note: This is a best effort cleanup - in production you might want more robust handling
				try {
					await supabase.auth.admin.deleteUser(authData.user.id);
				} catch (cleanupError) {
					console.error('Error cleaning up auth user:', cleanupError);
				}

				return json(
					{
						success: false,
						error: 'Failed to create customer account. Please try again.'
					},
					{ status: 500 }
				);
			}

			// Initialize inventory for new customer if needed
			// This could be used for customer-specific inventory tracking

			return json({
				success: true,
				message: 'Account created successfully! Please check your email to verify your account.',
				user: {
					id: authData.user.id,
					email: authData.user.email,
					full_name: fullName,
					phone: phone,
					role: 'customer'
				},
				requiresVerification: !authData.user.email_confirmed_at
			});
		} else {
			return json(
				{
					success: false,
					error: 'Failed to create account. Please try again.'
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Registration error:', error);
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
