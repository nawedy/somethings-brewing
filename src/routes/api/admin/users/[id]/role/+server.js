// File: src/routes/api/admin/users/[id]/role/+server.js
// Admin-only: Update a user's role (e.g., assign/remove admin)

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

async function requireAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return { ok: false, status: 401, message: 'Authorization required' };
  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) return { ok: false, status: 401, message: 'Invalid token' };
  const { data: customer } = await supabase
    .from('customers')
    .select('id, role')
    .eq('id', userData.user.id)
    .single();
  if (!customer || customer.role !== 'admin') return { ok: false, status: 403, message: 'Forbidden' };
  return { ok: true, adminId: customer.id };
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request }) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return json({ success: false, error: adminCheck.message }, { status: adminCheck.status });

    const targetId = params.id;
    const { role } = await request.json();
    if (!['admin', 'customer', 'support'].includes(role)) {
      return json({ success: false, error: 'Invalid role' }, { status: 400 });
    }

    // Prevent demoting the last admin (basic guard)
    if (adminCheck.adminId === targetId && role !== 'admin') {
      return json({ success: false, error: 'Cannot remove your own admin role' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('customers')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', targetId);

    if (updateError) {
      return json({ success: false, error: 'Failed to update role' }, { status: 500 });
    }

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
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}


