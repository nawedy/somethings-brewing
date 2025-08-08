// File: src/routes/api/products/+server.js
// List and create products (admin check for writes)

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
export async function GET() {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) return json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    return json({ success: true, products: data });
  } catch (e) {
    return json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    if (!(await isAdmin(request))) return json({ success: false, error: 'Forbidden' }, { status: 403 });
    const body = await request.json();
    const { name, slug, description, image_url, price, available = true, stock = 0 } = body;
    if (!name || !slug || typeof price !== 'number') {
      return json({ success: false, error: 'Invalid product data' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('products')
      .insert({ name, slug, description: description || null, image_url: image_url || null, price, available, stock })
      .select()
      .single();
    if (error) return json({ success: false, error: 'Failed to create product' }, { status: 500 });
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}


