// File: src/lib/stores/auth.js
// Authentication state management

import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase.js';
import { browser } from '$app/environment';

/**
 * @typedef {import('@supabase/supabase-js').User & { role?: string; is_affiliate?: boolean; full_name?: string }} ExtendedUser
 */

const createAuthStore = () => {
	const { subscribe, set, update } = writable({
		user: null,
		session: null,
		loading: true
	});

  let inactivityTimerId = null;
  let lastActivityAt = Date.now();
  const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

  function resetInactivityTimer() {
    lastActivityAt = Date.now();
    if (inactivityTimerId) {
      clearTimeout(inactivityTimerId);
    }
    inactivityTimerId = setTimeout(async () => {
      // Auto sign-out on inactivity
      await supabase.auth.signOut();
      set({ user: null, session: null, loading: false });
    }, INACTIVITY_LIMIT_MS);
  }

  function attachActivityListeners() {
    if (!browser) return;
    const bump = () => resetInactivityTimer();
    window.addEventListener('mousemove', bump);
    window.addEventListener('keydown', bump);
    window.addEventListener('click', bump);
  }

  return {
		subscribe,
		// Initialize auth state
		init: async () => {
			if (browser) {
				// Get initial session
				const {
					data: { session }
				} = await supabase.auth.getSession();

				/** @type {ExtendedUser | null} */
				let enrichedUser = session?.user ?? null;
        if (enrichedUser) {
          const { data: customer } = await supabase
            .from('customers')
            .select('role, is_affiliate, full_name')
            .eq('id', enrichedUser.id)
            .single();
          if (customer) {
						enrichedUser = /** @type {ExtendedUser} */ ({
							...enrichedUser,
							role: customer.role,
							is_affiliate: customer.is_affiliate,
							full_name: customer.full_name
						});
          }
        }

        set({
          user: enrichedUser,
          session,
          loading: false
        });

				// Listen for auth changes
			supabase.auth.onAuthStateChange(async (event, session) => {
				/** @type {ExtendedUser | null} */
				let nextUser = session?.user ?? null;
          if (nextUser) {
            const { data: customer } = await supabase
              .from('customers')
              .select('role, is_affiliate, full_name')
              .eq('id', nextUser.id)
              .single();
            if (customer) {
						nextUser = /** @type {ExtendedUser} */ ({
							...nextUser,
							role: customer.role,
							is_affiliate: customer.is_affiliate,
							full_name: customer.full_name
						});
            }
          }
          set({
            user: nextUser,
            session,
            loading: false
          });
        });

        // Start inactivity timer
        attachActivityListeners();
        resetInactivityTimer();
			} else {
				// Server environment: ensure loading is false with no session
				set({ user: null, session: null, loading: false });
			}
		},
		// Sign in with email and password
		signIn: async (email, password) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			return { data, error };
		},
		// Sign up with email and password
		signUp: async (email, password, userData = {}) => {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: userData
				}
			});
			return { data, error };
		},
		// Sign out
		signOut: async () => {
			const { error } = await supabase.auth.signOut();
			return { error };
		},
		// Reset password
		resetPassword: async (email) => {
			let origin = 'http://localhost';
			if (browser) {
				const url = new URL(window.location.href);
				origin = url.origin;
			}
			const redirectTo = `${origin}/auth/reset-password`;
			const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo
			});
			return { data, error };
		},
    // Global logout across all devices
    signOutAllDevices: async () => {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (!error) set({ user: null, session: null, loading: false });
      return { error };
    }
	};
};

export const auth = createAuthStore();
