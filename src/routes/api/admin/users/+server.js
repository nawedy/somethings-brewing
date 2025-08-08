// File: src/routes/api/admin/users/+server.js
// Admin-only: List users with pagination and search

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';
import { sanitizeString } from '$lib/validation.js';

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
  return { ok: true };
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, request }) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return json({ success: false, error: adminCheck.message }, { status: adminCheck.status });

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const q = sanitizeString(url.searchParams.get('q') || '', 128);

    let query = supabase.from('customers').select('*', { count: 'exact' }).order('created_at', { ascending: false });

    if (q) {
      query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: users, error, count } = await query;
    if (error) {
      return json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }

    return json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: count,
        total_pages: Math.ceil((count || 0) / limit)
      }
    });
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}


