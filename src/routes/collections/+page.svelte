<script>
	let collections = [
		{
			id: 'coll_001',
			name: 'African Origins',
			image_url: '/images/collections/africa.jpg',
			slug: 'african-origins'
		}
	];
</script>

<!-- File: src/routes/collections/+page.svelte -->
<!-- Purpose: Show product collections by region, roast, or feature -->

<svelte:head>
	<title>Our Coffee Collections | Something’s Brewing</title>
	<meta
		name="description"
		content="Explore curated coffee collections from Ethiopia, Yemen, and beyond. Hand-roasted, ethically sourced."
	/>
	<meta property="og:title" content="Our Coffee Collections" />
	<meta
		property="og:description"
		content="Explore curated coffee collections from Ethiopia, Yemen, and beyond."
	/>
	<meta property="og:url" content="https://www.somethingsbrewing.com/collections" />
</svelte:head>

<section class="space-y-6 p-8">
	<h1 class="text-2xl font-bold">Coffee Collections</h1>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
		{#each collections as c}
			<a href={`/collections/${c.slug}`} class="card bg-base-100 shadow">
				<img src={c.image_url} alt={c.name} class="h-48 w-full object-cover" />
				<div class="p-4">
					<h2 class="text-lg font-semibold">{c.name}</h2>
				</div>
			</a>
		{/each}
	</div>
</section>
