<!-- File: src/routes/account/settings/+page.svelte -->
<!-- Comprehensive user profile management page -->

<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase.js';

	let profile = null;
	let loading = true;
	let saving = false;
	let deleting = false;
	let error = '';
	let success = '';

	// Form data
	let fullName = '';
	let email = '';
	let phone = '';

	// Password change
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let passwordError = '';
	let passwordSuccess = '';
	let changingPassword = false;

	// Form validation
	let touched = {
		fullName: false,
		email: false,
		phone: false
	};

	$: formErrors = {
		fullName: touched.fullName && !fullName ? 'Full name is required' : '',
		email:
			touched.email && (!email || !isValidEmail(email)) ? 'Please enter a valid email address' : '',
		phone: touched.phone && phone && !isValidPhone(phone) ? 'Please enter a valid phone number' : ''
	};

	$: isFormValid = fullName && email && isValidEmail(email) && (!phone || isValidPhone(phone));

	$: passwordFormValid =
		currentPassword &&
		newPassword &&
		confirmPassword &&
		newPassword === confirmPassword &&
		newPassword.length >= 6;

	function isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function isValidPhone(phone) {
		return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
	}

	function handleBlur(field) {
		touched[field] = true;
	}

	onMount(async () => {
		await loadProfile();
	});

	async function loadProfile() {
		loading = true;
		error = '';

		try {
			const {
				data: { session }
			} = await supabase.auth.getSession();
			if (!session) {
				goto('/login?redirect=/account/settings');
				return;
			}

			const response = await fetch('/api/auth/profile', {
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			});

			const result = await response.json();

			if (result.success) {
				profile = result.profile;
				fullName = profile.full_name || '';
				email = profile.email || '';
				phone = profile.phone || '';
			} else {
				error = result.error || 'Failed to load profile';
			}
		} catch (err) {
			console.error('Error loading profile:', err);
			error = 'Failed to load profile';
		} finally {
			loading = false;
		}
	}

	async function handleSaveProfile() {
		// Mark all fields as touched for validation
		touched = {
			fullName: true,
			email: true,
			phone: true
		};

		if (!isFormValid) {
			error = 'Please fix the errors above';
			return;
		}

		saving = true;
		error = '';
		success = '';

		try {
			const {
				data: { session }
			} = await supabase.auth.getSession();
			if (!session) {
				goto('/login?redirect=/account/settings');
				return;
			}

			const response = await fetch('/api/auth/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`
				},
				body: JSON.stringify({
					full_name: fullName,
					email: email,
					phone: phone || null
				})
			});

			const result = await response.json();

			if (result.success) {
				success = result.message;
				profile = result.profile;
			} else {
				error = result.error;
			}
		} catch (err) {
			console.error('Error saving profile:', err);
			error = 'Failed to save profile';
		} finally {
			saving = false;
		}
	}

	async function handleChangePassword() {
		if (!passwordFormValid) {
			passwordError = 'Please fill in all fields correctly';
			return;
		}

		if (newPassword !== confirmPassword) {
			passwordError = 'New passwords do not match';
			return;
		}

		changingPassword = true;
		passwordError = '';
		passwordSuccess = '';

		try {
			// First verify current password by attempting to sign in
			const { error: verifyError } = await supabase.auth.signInWithPassword({
				email: profile.email,
				password: currentPassword
			});

			if (verifyError) {
				passwordError = 'Current password is incorrect';
				return;
			}

			// Update password
			const { error: updateError } = await supabase.auth.updateUser({
				password: newPassword
			});

			if (updateError) {
				passwordError = updateError.message;
			} else {
				passwordSuccess = 'Password updated successfully';
				// Clear form
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			}
		} catch (err) {
			console.error('Error changing password:', err);
			passwordError = 'Failed to change password';
		} finally {
			changingPassword = false;
		}
	}

	async function handleDeleteAccount() {
		if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
			return;
		}

		if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
			return;
		}

		deleting = true;
		error = '';

		try {
			const {
				data: { session }
			} = await supabase.auth.getSession();
			if (!session) {
				goto('/login');
				return;
			}

			const response = await fetch('/api/auth/profile', {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			});

			const result = await response.json();

			if (result.success) {
				// Sign out and redirect
				await supabase.auth.signOut();
				goto('/?message=account-deleted');
			} else {
				error = result.error;
			}
		} catch (err) {
			console.error('Error deleting account:', err);
			error = 'Failed to delete account';
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>Account Settings - Something's Brewing</title>
	<meta name="description" content="Manage your account settings and profile" />
</svelte:head>

<div class="mx-auto max-w-4xl space-y-8 p-6">
	<div class="text-center">
		<h1 class="text-3xl font-bold">Account Settings</h1>
		<p class="mt-2 text-sm opacity-70">Manage your profile and account preferences</p>
	</div>

	{#if loading}
		<div class="flex min-h-96 items-center justify-center">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if error && !profile}
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
	{:else}
		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Profile Information -->
			<div class="card bg-base-100 p-6">
				<h2 class="mb-6 text-xl font-bold">Profile Information</h2>

				<!-- Success Message -->
				{#if success}
					<div class="alert alert-success mb-4">
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
					<div class="alert alert-error mb-4">
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

				<form on:submit|preventDefault={handleSaveProfile} class="space-y-4">
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
							disabled={saving}
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
							disabled={saving}
						/>
						{#if formErrors.email}
							<div class="label">
								<span class="label-text-alt text-error">{formErrors.email}</span>
							</div>
						{/if}
						{#if email !== profile?.email}
							<div class="label">
								<span class="label-text-alt text-warning"
									>Changing email will require verification</span
								>
							</div>
						{/if}
					</div>

					<!-- Phone -->
					<div>
						<label class="label" for="phone">
							<span class="label-text">Phone Number (Optional)</span>
						</label>
						<input
							id="phone"
							type="tel"
							class="input input-bordered w-full {formErrors.phone ? 'input-error' : ''}"
							placeholder="+1 (555) 123-4567"
							bind:value={phone}
							on:blur={() => handleBlur('phone')}
							disabled={saving}
						/>
						{#if formErrors.phone}
							<div class="label">
								<span class="label-text-alt text-error">{formErrors.phone}</span>
							</div>
						{/if}
					</div>

					<!-- Submit Button -->
					<button type="submit" class="btn btn-primary w-full" disabled={saving || !isFormValid}>
						{#if saving}
							<span class="loading loading-spinner loading-sm"></span>
							Saving...
						{:else}
							Save Changes
						{/if}
					</button>
				</form>
			</div>

			<!-- Password Change -->
			<div class="card bg-base-100 p-6">
				<h2 class="mb-6 text-xl font-bold">Change Password</h2>

				<!-- Password Success Message -->
				{#if passwordSuccess}
					<div class="alert alert-success mb-4">
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
						<span>{passwordSuccess}</span>
					</div>
				{/if}

				<!-- Password Error Message -->
				{#if passwordError}
					<div class="alert alert-error mb-4">
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
						<span>{passwordError}</span>
					</div>
				{/if}

				<form on:submit|preventDefault={handleChangePassword} class="space-y-4">
					<!-- Current Password -->
					<div>
						<label class="label" for="currentPassword">
							<span class="label-text">Current Password</span>
						</label>
						<input
							id="currentPassword"
							type="password"
							class="input input-bordered w-full"
							placeholder="Enter current password"
							bind:value={currentPassword}
							disabled={changingPassword}
						/>
					</div>

					<!-- New Password -->
					<div>
						<label class="label" for="newPassword">
							<span class="label-text">New Password</span>
						</label>
						<input
							id="newPassword"
							type="password"
							class="input input-bordered w-full"
							placeholder="At least 6 characters"
							bind:value={newPassword}
							disabled={changingPassword}
						/>
					</div>

					<!-- Confirm New Password -->
					<div>
						<label class="label" for="confirmPassword">
							<span class="label-text">Confirm New Password</span>
						</label>
						<input
							id="confirmPassword"
							type="password"
							class="input input-bordered w-full"
							placeholder="Confirm new password"
							bind:value={confirmPassword}
							disabled={changingPassword}
						/>
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						class="btn btn-primary w-full"
						disabled={changingPassword || !passwordFormValid}
					>
						{#if changingPassword}
							<span class="loading loading-spinner loading-sm"></span>
							Changing Password...
						{:else}
							Change Password
						{/if}
					</button>
				</form>
			</div>
		</div>

		<!-- Account Information -->
		{#if profile}
			<div class="card bg-base-100 p-6">
				<h2 class="mb-6 text-xl font-bold">Account Information</h2>
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<span class="text-sm opacity-70">Account Created:</span>
						<p class="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
					</div>
					<div>
						<span class="text-sm opacity-70">Last Updated:</span>
						<p class="font-medium">{new Date(profile.updated_at).toLocaleDateString()}</p>
					</div>
					<div>
						<span class="text-sm opacity-70">Email Verified:</span>
						<p class="font-medium">
							{#if profile.email_verified}
								<span class="badge badge-success">Verified</span>
							{:else}
								<span class="badge badge-warning">Not Verified</span>
							{/if}
						</p>
					</div>
					<div>
						<span class="text-sm opacity-70">Account Type:</span>
						<p class="font-medium capitalize">{profile.role}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Danger Zone -->
		<div class="card border-error bg-base-100 border p-6">
			<h2 class="text-error mb-6 text-xl font-bold">Danger Zone</h2>
			<div class="space-y-4">
				<div>
					<h3 class="font-semibold">Delete Account</h3>
					<p class="text-sm opacity-70">
						Permanently delete your account and all associated data. This action cannot be undone.
					</p>
				</div>
				<button
					class="btn btn-error btn-outline"
					on:click={handleDeleteAccount}
					disabled={deleting}
				>
					{#if deleting}
						<span class="loading loading-spinner loading-sm"></span>
						Deleting Account...
					{:else}
						Delete Account
					{/if}
				</button>
			</div>
		</div>
	{/if}
</div>
