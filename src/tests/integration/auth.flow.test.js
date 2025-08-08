// File: src/tests/integration/auth.flow.test.js
// Purpose: Integration-like test for login API handler

import { describe, it, expect, vi } from 'vitest';
import * as loginModule from '@/routes/api/auth/login/+server.js';

// Minimal Request shim
class MockRequest {
  constructor(body) {
    this._body = body;
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }
  async json() { return this._body; }
}

describe('API /api/auth/login', () => {
  it('rejects missing credentials', async () => {
    const res = await loginModule.POST({ request: new MockRequest({}) });
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });
});


