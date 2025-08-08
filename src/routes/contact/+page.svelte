<!-- File: src/routes/contact/+page.svelte -->
<!-- Purpose: Contact Us page with validated form -->

<script>
	let name = '';
	let email = '';
	let message = '';
	let submitted = false;

	function handleSubmit() {
		if (name && email && message) {
			submitted = true;
		}
	}
</script>

<section class="mx-auto max-w-2xl p-10">
	<h1 class="mb-6 text-center font-serif text-4xl">Contact Us</h1>
	{#if submitted}
		<p class="text-success text-center">Thanks for your message! We’ll get back to you soon.</p>
	{:else}
		<form on:submit|preventDefault={handleSubmit} class="grid gap-4">
			<input
				type="text"
				placeholder="Name"
				bind:value={name}
				class="input input-bordered w-full"
				required
			/>
			<input
				type="email"
				placeholder="Email"
				bind:value={email}
				class="input input-bordered w-full"
				required
			/>
			<textarea
				rows="5"
				placeholder="Message"
				bind:value={message}
				class="textarea textarea-bordered w-full"
				required
			></textarea>
			<button class="btn btn-primary w-full">Send Message</button>
		</form>
	{/if}
</section>
