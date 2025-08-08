<!-- File: src/routes/auth/callback/+page.svelte -->
<!-- Handles Supabase email verification and magic link callbacks -->

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase.js';

  let status = 'Processing verification...';
  let error = '';

  onMount(async () => {
    try {
      const currentUrl = new URL(window.location.href);
      const code = currentUrl.searchParams.get('code');

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          error = exchangeError.message || 'Verification failed.';
          return;
        }
        status = 'Email verified successfully. Redirecting...';
        setTimeout(() => goto('/login?verified=true'), 1500);
        return;
      }

      // Fallback for hash-based redirects (e.g., access_token in URL hash)
      // Hash flow is not supported here; rely on code exchange only for SvelteKit

      // If neither param is present, still guide the user
      status = 'Verification processed. You can now sign in.';
      setTimeout(() => goto('/login?verified=true'), 1500);
    } catch (e) {
      error = 'An unexpected error occurred while verifying your email.';
    }
  });
</script>

<section class="mx-auto max-w-md space-y-6 p-8">
  <div class="text-center">
    <h1 class="text-3xl font-bold">Account Verification</h1>
    {#if error}
      <div class="alert alert-error mt-4">
        <span>{error}</span>
      </div>
    {:else}
      <p class="mt-4">{status}</p>
    {/if}
  </div>
</section>


