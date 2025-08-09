// File: src/tests/api/orders.create.test.js
// Purpose: API route test for orders/create minimal validation path

import { describe, it, expect } from 'vitest';
import * as ordersCreate from '../../routes/api/orders/create/+server.js';

describe('API /api/orders/create', () => {
  it('requires items array and customer_id', async () => {
    const res1 = await ordersCreate.POST(/** @type {any} */ ({ request: new Request('http://localhost/api/orders/create', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({})
    }) }));
    expect(res1.status).toBe(400);
    const res2 = await ordersCreate.POST(/** @type {any} */ ({ request: new Request('http://localhost/api/orders/create', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ items: [] })
    }) }));
    expect(res2.status).toBe(400);
  });
});


