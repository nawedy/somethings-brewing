<!-- File: src/components/ProductEditor.svelte -->
<!-- Purpose: Admin form for creating/editing products -->

<script>
	import { createEventDispatcher } from 'svelte';

	export let product = {
		id: null,
		name: '',
		description: '',
		price: '',
		image_url: '',
		tags: ''
	};

	const dispatch = createEventDispatcher();

	function handleSave() {
		dispatch('save', { ...product });
	}
</script>

<form on:submit|preventDefault={handleSave} class="space-y-4">
	<input class="input input-bordered w-full" placeholder="Name" bind:value={product.name} />
	<textarea
		class="textarea textarea-bordered w-full"
		placeholder="Description"
		bind:value={product.description}
	/>
	<input
		class="input input-bordered w-full"
		type="number"
		placeholder="Price"
		bind:value={product.price}
	/>
	<input
		class="input input-bordered w-full"
		placeholder="Image URL"
		bind:value={product.image_url}
	/>
	<input
		class="input input-bordered w-full"
		placeholder="Tags (comma-separated)"
		bind:value={product.tags}
	/>

	<button type="submit" class="btn btn-primary">Save Product</button>
</form>
