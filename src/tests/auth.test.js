// File: src/tests/auth.test.js
// Purpose: Basic auth flow tests (unit-level) for store functions

import { describe, it, expect, vi } from 'vitest';
import * as supabaseModule from '../lib/supabase.js';
import { auth } from '../lib/stores/auth.js';

vi.mock('../lib/supabase.js', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        signUp: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null })
      }
    }
  };
});

describe('auth store', () => {
  it('initializes without session', async () => {
    await auth.init();
    /** @type {{ user: any, loading: boolean } | undefined} */
    let current;
    auth.subscribe((s) => (current = s))();
    expect(current && current.user).toBeNull();
    expect(current && current.loading).toBe(false);
  });

  it('resetPassword returns without error', async () => {
    // JSDOM sets window; ensure URL origin available
    const { data, error } = await auth.resetPassword('user@example.com');
    expect(error).toBeNull();
  });
});


