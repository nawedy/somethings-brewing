<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let name = '';
	let email = '';
	let message = '';
	let submitted = false;
	let error = null;

	function validateEmail(email) {
		return /\S+@\S+\.\S+/.test(email);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		error = null;

		if (!name || !email || !message) {
			error = 'All fields are required.';
			return;
		}

		if (!validateEmail(email)) {
			error = 'Please enter a valid email address.';
			return;
		}

		// 🔗 You can send this data to Supabase, an API, or Email service here
		try {
			submitted = true;
			dispatch('submit', { name, email, message });
		} catch (err) {
			error = 'Something went wrong. Please try again.';
		}
	}
</script>

<section class="bg-base-100 mx-auto max-w-2xl rounded-lg p-6 shadow">
	<h2 class="mb-4 text-2xl font-bold">Contact Us</h2>

	{#if submitted}
		<div class="alert alert-success shadow-sm">
			<span>Thank you! We'll be in touch shortly.</span>
		</div>
	{:else}
		{#if error}
			<div class="alert alert-error mb-4 shadow-sm">
				<span>{error}</span>
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div>
                <label class="label" for="contact-name">
					<span class="label-text">Name</span>
				</label>
				<input
                    id="contact-name"
					class="input input-bordered w-full"
					type="text"
					bind:value={name}
					placeholder="Your name"
				/>
			</div>

            <div>
                <label class="label" for="contact-email">
					<span class="label-text">Email</span>
				</label>
				<input
                    id="contact-email"
					class="input input-bordered w-full"
					type="email"
					bind:value={email}
					placeholder="you@example.com"
				/>
			</div>

            <div>
                <label class="label" for="contact-message">
					<span class="label-text">Message</span>
				</label>
				<textarea
                    id="contact-message"
					class="textarea textarea-bordered w-full"
					rows="5"
					bind:value={message}
					placeholder="Your message..."
				></textarea>
			</div>

			<button type="submit" class="btn btn-primary w-full">Send Message</button>
		</form>
	{/if}
</section>
