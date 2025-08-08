<!-- File: src/app/components/BlogEditor.svelte -->
<!-- Purpose: Admin blog post creation/edit form -->

<script>
	import { createEventDispatcher } from 'svelte';

	export let post = {
		id: null,
		title: '',
		slug: '',
		content: '',
		image_url: '',
		tags: ''
	};

	const dispatch = createEventDispatcher();

	function handleSave() {
		dispatch('save', { ...post });
	}
</script>

<form on:submit|preventDefault={handleSave} class="space-y-4">
	<input class="input input-bordered w-full" placeholder="Title" bind:value={post.title} />
	<input class="input input-bordered w-full" placeholder="Slug" bind:value={post.slug} />
	<textarea
		class="textarea textarea-bordered w-full"
		placeholder="Content"
		bind:value={post.content}
	></textarea>
	<input class="input input-bordered w-full" placeholder="Image URL" bind:value={post.image_url} />
	<input class="input input-bordered w-full" placeholder="Tags" bind:value={post.tags} />

	<button type="submit" class="btn btn-primary">Save Blog</button>
</form>
