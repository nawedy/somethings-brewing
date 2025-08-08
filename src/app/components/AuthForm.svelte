<!-- File: src/app/components/AuthForm.svelte -->
<!-- Purpose: Shared login/register form -->

<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let email = '';
	let password = '';
	let isRegister = false;

	function handleSubmit() {
		dispatch('submit', { email, password, isRegister });
	}
</script>

<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
	<input
		class="input input-bordered w-full"
		type="email"
		bind:value={email}
		placeholder="Email"
		required
	/>
	<input
		class="input input-bordered w-full"
		type="password"
		bind:value={password}
		placeholder="Password"
		required
	/>

	<div class="form-control">
		<label class="label cursor-pointer">
			<span class="label-text">Register instead?</span>
			<input type="checkbox" bind:checked={isRegister} class="toggle" />
		</label>
	</div>

	<button type="submit" class="btn btn-primary w-full">
		{isRegister ? 'Register' : 'Login'}
	</button>
</form>
