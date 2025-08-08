// File: src/routes/api/emails/send-order-confirmation/+server.js
// Insert an email into email_logs to trigger SendGrid via DB trigger

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';
import { isValidEmail, sanitizeString } from '$lib/validation.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const payload = await request.json();
    const recipient = sanitizeString(payload?.recipient || '');
    const subject = sanitizeString(payload?.subject || '', 256);
    const body = sanitizeString(payload?.body || '', 5000);
    if (!recipient || !subject || !body || !isValidEmail(recipient)) {
      return json({ success: false, error: 'recipient, subject and body are required' }, { status: 400 });
    }
    const { error } = await supabase.from('email_logs').insert({ recipient, subject, body });
    if (error) return json({ success: false, error: 'Failed to queue email' }, { status: 500 });
    return json({ success: true });
  } catch (e) {
    return json({ success: false, error: 'Internal server error' }, { status: 500 });
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


