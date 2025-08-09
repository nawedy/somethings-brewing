<!-- File: src/routes/register/+page.svelte -->
<!-- Enhanced user registration with customer record creation -->

<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';
  import { csrfHeaders } from '$lib/csrf.js';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let fullName = '';
	let phone = '';
	let error = '';
	let success = '';
	let loading = false;

	// Form validation
	let touched = {
		email: false,
		password: false,
		confirmPassword: false,
		fullName: false
	};

	$: formErrors = {
		email:
			touched.email && (!email || !isValidEmail(email)) ? 'Please enter a valid email address' : '',
		password:
			touched.password && (!password || password.length < 6)
				? 'Password must be at least 6 characters'
				: '',
		confirmPassword:
			touched.confirmPassword && password !== confirmPassword ? 'Passwords do not match' : '',
		fullName: touched.fullName && !fullName ? 'Full name is required' : ''
	};

	$: isFormValid =
		email &&
		password &&
		confirmPassword &&
		fullName &&
		password === confirmPassword &&
		password.length >= 6 &&
		isValidEmail(email);

	function isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function handleBlur(field) {
		touched[field] = true;
	}

	async function handleSubmit() {
		// Mark all fields as touched for validation
		touched = {
			email: true,
			password: true,
			confirmPassword: true,
			fullName: true
		};

		if (!isFormValid) {
			error = 'Please fix the errors above';
			return;
		}

		loading = true;
		error = '';
		success = '';

    try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...csrfHeaders()
        },
				body: JSON.stringify({
					email,
					password,
					fullName,
					phone
				})
			});

			const result = await response.json();

			if (result.success) {
				success = result.message;

				if (result.requiresVerification) {
					// Show verification message
					setTimeout(() => {
						goto('/login?message=verification-sent');
					}, 3000);
				} else {
					// Auto-login if verification not required
					setTimeout(() => {
						goto('/account');
					}, 2000);
				}
			} else {
				error = result.error;
			}
		} catch (err) {
			console.error('Registration error:', err);
			error = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Create Account - Something's Brewing</title>
	<meta name="description" content="Create your coffee lover's account" />
</svelte:head>

<main>
<section class="mx-auto max-w-md space-y-6 p-8">
	<div class="text-center">
		<h1 class="text-3xl font-bold">Create an Account</h1>
		<p class="mt-2 text-sm opacity-70">Join the Something's Brewing community</p>
	</div>

<form on:submit|preventDefault={handleSubmit} aria-label="registration-form" class="space-y-4">
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

		<!-- Full Name -->
		<div>
			<label class="label" for="fullName">
				<span class="label-text">Full Name *</span>
			</label>
			<input
				id="fullName"
				type="text"
				class="input input-bordered w-full {formErrors.fullName ? 'input-error' : ''}"
				placeholder="John Doe"
				bind:value={fullName}
				on:blur={() => handleBlur('fullName')}
				disabled={loading}
			/>
			{#if formErrors.fullName}
				<div class="label">
					<span class="label-text-alt text-error">{formErrors.fullName}</span>
				</div>
			{/if}
		</div>

		<!-- Email -->
		<div>
			<label class="label" for="email">
				<span class="label-text">Email Address *</span>
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

		<!-- Phone (Optional) -->
		<div>
			<label class="label" for="phone">
				<span class="label-text">Phone Number (Optional)</span>
			</label>
			<input
				id="phone"
				type="tel"
				class="input input-bordered w-full"
				placeholder="+1 (555) 123-4567"
				bind:value={phone}
				disabled={loading}
			/>
		</div>

		<!-- Password -->
		<div>
			<label class="label" for="password">
				<span class="label-text">Password *</span>
			</label>
			<input
				id="password"
				type="password"
				class="input input-bordered w-full {formErrors.password ? 'input-error' : ''}"
				placeholder="At least 6 characters"
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

		<!-- Confirm Password -->
		<div>
			<label class="label" for="confirmPassword">
				<span class="label-text">Confirm Password *</span>
			</label>
			<input
				id="confirmPassword"
				type="password"
				class="input input-bordered w-full {formErrors.confirmPassword ? 'input-error' : ''}"
				placeholder="Confirm your password"
				bind:value={confirmPassword}
				on:blur={() => handleBlur('confirmPassword')}
				disabled={loading}
			/>
			{#if formErrors.confirmPassword}
				<div class="label">
					<span class="label-text-alt text-error">{formErrors.confirmPassword}</span>
				</div>
			{/if}
		</div>

		<!-- Submit Button -->
		<button type="submit" class="btn btn-primary w-full" disabled={loading || !isFormValid}>
			{#if loading}
				<span class="loading loading-spinner loading-sm"></span>
				Creating Account...
			{:else}
				Create Account
			{/if}
		</button>
	</form>

	<!-- Login Link -->
	<div class="text-center">
		<p class="text-sm">
			Already have an account?
			<a href="/login" class="link link-primary">Sign in here</a>
		</p>
	</div>

	<!-- Terms and Privacy -->
	<div class="text-center">
		<p class="text-xs opacity-70">
			By creating an account, you agree to our
			<a href="/terms" class="link">Terms of Service</a> and
			<a href="/privacy" class="link">Privacy Policy</a>
		</p>
	</div>
</section>
</main>
