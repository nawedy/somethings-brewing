<!-- File: src/routes/auth/reset-password/+page.svelte -->
<!-- Handles Supabase password reset redirect to allow user to set new password -->

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase.js';

  let newPassword = '';
  let confirmPassword = '';
  let loading = true;
  let saving = false;
  let error = '';
  let success = '';

  function parseHashTokens() {
    const hash = window.location.hash.replace('#', '');
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    return { access_token, refresh_token };
  }

  onMount(async () => {
    try {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) error = exchangeError.message || 'Invalid or expired reset link.';
      } else if (window.location.hash) {
        const { access_token, refresh_token } = parseHashTokens();
        if (access_token && refresh_token) {
          const { error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
          if (setErr) error = setErr.message || 'Invalid or expired reset link.';
        }
      }
    } catch (e) {
      error = 'Failed to process reset link.';
    } finally {
      loading = false;
    }
  });

  async function handleSubmit() {
    if (!newPassword || newPassword.length < 6) {
      error = 'Password must be at least 6 characters.';
      return;
    }
    if (newPassword !== confirmPassword) {
      error = 'Passwords do not match.';
      return;
    }
    error = '';
    saving = true;
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        error = updateError.message || 'Failed to update password.';
        return;
      }
      success = 'Password updated successfully. Redirecting to login...';
      setTimeout(() => goto('/login'), 1500);
    } catch (e) {
      error = 'Unexpected error updating password.';
    } finally {
      saving = false;
    }
  }
</script>

<section class="mx-auto max-w-md space-y-6 p-8">
  <h1 class="text-3xl font-bold text-center">Reset Password</h1>

  {#if loading}
    <div class="flex min-h-48 items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else}
    {#if error}
      <div class="alert alert-error">
        <span>{error}</span>
      </div>
    {/if}

    {#if success}
      <div class="alert alert-success">
        <span>{success}</span>
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label class="label" for="newPassword"><span class="label-text">New Password</span></label>
        <input id="newPassword" type="password" class="input input-bordered w-full" bind:value={newPassword} />
      </div>
      <div>
        <label class="label" for="confirmPassword"><span class="label-text">Confirm New Password</span></label>
        <input id="confirmPassword" type="password" class="input input-bordered w-full" bind:value={confirmPassword} />
      </div>
      <button class="btn btn-primary w-full" disabled={saving}>
        {#if saving}
          <span class="loading loading-spinner loading-sm"></span>
          Saving...
        {:else}
          Update Password
        {/if}
      </button>
    </form>
  {/if}
</section>


