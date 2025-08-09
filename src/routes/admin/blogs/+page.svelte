<!-- File: src/routes/admin/blogs/+page.svelte -->
<!-- Purpose: Admin blog management dashboard -->

<script>
	import BlogEditor from '$components/BlogEditor.svelte';

	let posts = [
		{
			id: 'blog_001',
			title: 'Perfecting the Pour Over',
			slug: 'perfecting-pour-over',
			content: 'Master the pour over technique with these tips...',
			image_url: '/images/blogs/pour-over.jpg',
			tags: 'pour over, brewing'
		},
		{
			id: 'blog_002',
			title: 'Exploring Yemeni Coffee Origins',
			slug: 'yemeni-coffee-origins',
			content: 'Discover the rich history of Yemeni beans...',
			image_url: '/images/blogs/yemeni.jpg',
			tags: 'yemen, history, origins'
		}
	];

	let selected = null;
	let editing = false;

	function editPost(post) {
		selected = { ...post };
		editing = true;
	}

	function handleSave(updated) {
		const index = posts.findIndex((p) => p.id === updated.id);
		if (index !== -1) posts[index] = updated;
		else posts.push({ ...updated, id: `blog_${posts.length + 1}` });
		selected = null;
		editing = false;
	}
</script>

<section class="space-y-8 p-10">
	<h1 class="text-3xl font-bold">Manage Blog Posts</h1>

	{#if editing}
    <BlogEditor bind:post={selected} on:save={(e) => handleSave(e.detail)} />
	{:else}
		<button
			class="btn btn-primary mb-4"
			on:click={() => {
				selected = { title: '', slug: '', content: '', image_url: '', tags: '' };
				editing = true;
			}}
		>
			+ Add New Post
		</button>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each posts as p}
				<div class="card bg-base-100 p-4 shadow">
					<img src={p.image_url} alt={p.title} class="mb-4 h-40 w-full rounded object-cover" />
					<h2 class="text-lg font-semibold">{p.title}</h2>
					<p class="text-sm text-gray-500">/{p.slug}</p>
					<p class="mt-2 text-sm text-gray-400">{p.tags}</p>
					<div class="mt-4 text-right">
						<button class="btn btn-sm btn-outline" on:click={() => editPost(p)}>Edit</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
