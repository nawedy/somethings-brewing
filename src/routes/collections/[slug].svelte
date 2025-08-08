<!-- File: src/routes/collections/[slug].svelte -->
<!-- Purpose: Individual collection page showing related products -->

<script>
	import { page } from '$app/stores';
	import ProductCard from '$components/ProductCard.svelte';

	let slug = $page.params.slug;
	let collection = {
		title: 'African Origins',
		description: 'Explore rich and fruity coffee traditions from Ethiopia, Kenya, and Rwanda.',
		products: [
			{
				slug: 'ethiopian-harrar',
				name: 'Ethiopian Harrar',
				image: '/images/bag1.png',
				price: '$16.00'
			},
			{ slug: 'kenya-aa', name: 'Kenya AA', image: '/images/bag3.png', price: '$17.50' }
		]
	};
</script>

<svelte:head>
	<title>{collection.title} | Coffee Collections | Something’s Brewing</title>
	<meta name="description" content={collection.description} />
	<meta property="og:title" content={collection.title} />
	<meta property="og:description" content={collection.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`https://www.somethingsbrewing.com/collections/${slug}`} />
	<meta property="og:image" content="https://www.somethingsbrewing.com/images/social-preview.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={collection.title} />
	<meta name="twitter:description" content={collection.description} />
	<link rel="canonical" href={`https://www.somethingsbrewing.com/collections/${slug}`} />
</svelte:head>

<section class="p-10">
	<h1 class="mb-4 font-serif text-4xl">{collection.title}</h1>
	<p class="text-base-content mb-10">{collection.description}</p>
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each collection.products as product}
			<ProductCard {product} />
		{/each}
	</div>
</section>
