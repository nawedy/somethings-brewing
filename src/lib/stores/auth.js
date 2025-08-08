// File: src/lib/stores/auth.js
// Authentication state management

import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase.js';
import { browser } from '$app/environment';

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

        let enrichedUser = session?.user ?? null;
        if (enrichedUser) {
          const { data: customer } = await supabase
            .from('customers')
            .select('role, is_affiliate, full_name')
            .eq('id', enrichedUser.id)
            .single();
          if (customer) {
            enrichedUser = { ...enrichedUser, role: customer.role, is_affiliate: customer.is_affiliate, full_name: customer.full_name };
          }
        }

        set({
          user: enrichedUser,
          session,
          loading: false
        });

				// Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          let nextUser = session?.user ?? null;
          if (nextUser) {
            const { data: customer } = await supabase
              .from('customers')
              .select('role, is_affiliate, full_name')
              .eq('id', nextUser.id)
              .single();
            if (customer) {
              nextUser = { ...nextUser, role: customer.role, is_affiliate: customer.is_affiliate, full_name: customer.full_name };
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
      const url = new URL(window.location.href);
      const redirectTo = `${url.origin}/auth/reset-password`;
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
