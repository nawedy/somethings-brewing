// File: src/routes/api/auth/resend-verification/+server.js
// Resend email verification email via Supabase

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const { email } = await request.json();
    if (!email) {
      return json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const emailRedirectTo = `${origin}/auth/callback`;

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo }
    });

    if (error) {
      return json({ success: false, error: error.message }, { status: 400 });
    }

    return json({ success: true, message: 'Verification email resent.' });
  } catch (e) {
    return json(
      { success: false, error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

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


