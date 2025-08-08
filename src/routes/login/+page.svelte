<!-- File: src/routes/login/+page.svelte -->
<!-- Enhanced login form with improved UX and error handling -->

<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth.js';
  import { csrfHeaders } from '$lib/csrf.js';

	let email = '';
	let password = '';
	let error = '';
	let success = '';
	let loading = false;
	let rememberMe = false;
    let resendLoading = false;

	// Form validation
	let touched = {
		email: false,
		password: false
	};

	$: formErrors = {
		email:
			touched.email && (!email || !isValidEmail(email)) ? 'Please enter a valid email address' : '',
		password: touched.password && !password ? 'Password is required' : ''
	};

	$: isFormValid = email && password && isValidEmail(email);

	function isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function handleBlur(field) {
		touched[field] = true;
	}

	onMount(() => {
		// Check for URL parameters
		const message = $page.url.searchParams.get('message');
		if (message === 'verification-sent') {
			success =
				'Account created! Please check your email to verify your account before logging in.';
		} else if (message === 'password-reset') {
			success = 'Password reset email sent! Check your inbox for instructions.';
		}

		if ($page.url.searchParams.get('verified') === 'true') {
			success = 'Email verified successfully. You can now sign in.';
		}

		// Load remembered email
		const rememberedEmail = localStorage.getItem('rememberedEmail');
		if (rememberedEmail) {
			email = rememberedEmail;
			rememberMe = true;
		}
	});

	async function handleSubmit() {
		// Mark all fields as touched for validation
		touched = {
			email: true,
			password: true
		};

		if (!isFormValid) {
			error = 'Please fix the errors above';
			return;
		}

		loading = true;
		error = '';

    try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...csrfHeaders()
        },
				body: JSON.stringify({
					email,
					password
				})
			});

			const result = await response.json();

			if (result.success) {
				// Handle remember me
				if (rememberMe) {
					localStorage.setItem('rememberedEmail', email);
				} else {
					localStorage.removeItem('rememberedEmail');
				}

				// Initialize auth store with user data
				await auth.init();

				// Redirect to intended page or account
				const redirectTo = $page.url.searchParams.get('redirect') || '/account';
				goto(redirectTo);
			} else {
				error = result.error;
			}
		} catch (err) {
			console.error('Login error:', err);
			error = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function handleResendVerification() {
		if (!email) {
			error = 'Please enter your email address first';
			return;
		}
		if (!isValidEmail(email)) {
			error = 'Please enter a valid email address';
			return;
		}
		resendLoading = true;
		error = '';
		success = '';
		try {
			const res = await fetch('/api/auth/resend-verification', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const result = await res.json();
			if (result.success) {
				success = 'Verification email resent. Please check your inbox.';
			} else {
				error = result.error || 'Failed to resend verification email.';
			}
		} catch (e) {
			error = 'Unexpected error resending verification email.';
		} finally {
			resendLoading = false;
		}
	}

	async function handleForgotPassword() {
		if (!email) {
			error = 'Please enter your email address first';
			return;
		}

		if (!isValidEmail(email)) {
			error = 'Please enter a valid email address';
			return;
		}

		loading = true;
		error = '';

		try {
			const { error: resetError } = await auth.resetPassword(email);

			if (resetError) {
				error = resetError.message;
			} else {
				success = 'Password reset email sent! Check your inbox for instructions.';
			}
		} catch (err) {
			console.error('Password reset error:', err);
			error = 'Failed to send reset email. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Something's Brewing</title>
	<meta name="description" content="Sign in to your coffee lover's account" />
</svelte:head>

<section class="mx-auto max-w-md space-y-6 p-8">
	<div class="text-center">
		<h1 class="text-3xl font-bold">Welcome Back</h1>
		<p class="mt-2 text-sm opacity-70">Sign in to your account</p>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<!-- Success Message -->
		{#if success}
			<div class="alert alert-success">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>{success}</span>
			</div>
		{/if}

		<!-- Error Message -->
		{#if error}
			<div class="alert alert-error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Email -->
		<div>
			<label class="label" for="email">
				<span class="label-text">Email Address</span>
			</label>
			<input
				id="email"
				type="email"
				class="input input-bordered w-full {formErrors.email ? 'input-error' : ''}"
				placeholder="your@email.com"
				bind:value={email}
				on:blur={() => handleBlur('email')}
				disabled={loading}
			/>
			{#if formErrors.email}
				<div class="label">
					<span class="label-text-alt text-error">{formErrors.email}</span>
				</div>
			{/if}
		</div>

		<!-- Password -->
		<div>
			<label class="label" for="password">
				<span class="label-text">Password</span>
			</label>
			<input
				id="password"
				type="password"
				class="input input-bordered w-full {formErrors.password ? 'input-error' : ''}"
				placeholder="Your password"
				bind:value={password}
				on:blur={() => handleBlur('password')}
				disabled={loading}
			/>
			{#if formErrors.password}
				<div class="label">
					<span class="label-text-alt text-error">{formErrors.password}</span>
				</div>
			{/if}
		</div>

		<!-- Remember Me & Forgot Password -->
		<div class="flex items-center justify-between">
			<label class="flex cursor-pointer items-center gap-2">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={rememberMe} />
				<span class="text-sm">Remember me</span>
			</label>
			<button
				type="button"
				class="link link-primary text-sm"
				on:click={handleForgotPassword}
				disabled={loading}
			>
				Forgot password?
			</button>
		</div>

		<div class="text-right mt-2">
			<button type="button" class="btn btn-ghost btn-xs" on:click={handleResendVerification} disabled={resendLoading || loading}>
				{#if resendLoading}
					<span class="loading loading-spinner loading-xs"></span>
					Sending...
				{:else}
					Resend verification email
				{/if}
			</button>
		</div>

		<!-- Submit Button -->
		<button type="submit" class="btn btn-primary w-full" disabled={loading || !isFormValid}>
			{#if loading}
				<span class="loading loading-spinner loading-sm"></span>
				Signing in...
			{:else}
				Sign In
			{/if}
		</button>
	</form>

	<!-- Register Link -->
	<div class="text-center">
		<p class="text-sm">
			Don't have an account?
			<a href="/register" class="link link-primary">Create one here</a>
		</p>
	</div>

	<!-- Social Login (Future Enhancement) -->
	<div class="divider">Or continue with</div>
	<div class="grid grid-cols-2 gap-4">
		<button class="btn btn-outline" disabled>
			<svg class="h-5 w-5" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="currentColor"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				/>
				<path
					fill="currentColor"
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				/>
				<path
					fill="currentColor"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				/>
			</svg>
			Google
		</button>
		<button class="btn btn-outline" disabled>
			<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
				<path
					d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
				/>
			</svg>
			Facebook
		</button>
	</div>
	<p class="text-center text-xs opacity-50">Social login coming soon</p>
</section>
