// File: src/tests/integration/auth.flow.test.js
// Purpose: Integration-like test for login API handler

import { describe, it, expect, vi } from 'vitest';
import * as loginModule from '../../routes/api/auth/login/+server.js';

describe('API /api/auth/login', () => {
  it('rejects missing credentials', async () => {
    const res = await loginModule.POST(/** @type {any} */ ({ request: new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({})
    }) }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });
});


