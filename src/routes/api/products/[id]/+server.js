// File: src/routes/api/products/[id]/+server.js
// Update a product (admin only)

import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

async function isAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData?.user) return false;
  const { data: customer } = await supabase.from('customers').select('role').eq('id', userData.user.id).single();
  return customer?.role === 'admin';
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request }) {
  try {
    if (!(await isAdmin(request))) return json({ success: false, error: 'Forbidden' }, { status: 403 });
    const id = params.id;
    const body = await request.json();
    const allowed = ['name', 'slug', 'description', 'image_url', 'price', 'available', 'stock'];
    const update = {};
    for (const key of allowed) if (key in body) update[key] = body[key];
    if (Object.keys(update).length === 0) return json({ success: false, error: 'No valid fields' }, { status: 400 });
    update.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from('products').update(update).eq('id', id).select().single();
    if (error) return json({ success: false, error: 'Failed to update product' }, { status: 500 });
    return json({ success: true, product: data });
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


