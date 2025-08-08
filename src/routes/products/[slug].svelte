<!-- File: src/routes/products/[slug].svelte -->
<!-- Purpose: SEO-enhanced product detail page with corrected <svelte:head> placement -->

<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { cart } from '$lib/stores/cart.js';

	let product;
	let slug = $page.params.slug;

	const productData = {
		'ethiopian-harrar': {
			name: 'Ethiopian Harrar',
			image: '/images/bag1.png',
			price: '$16.00',
			description: 'A rich and fruity blend from the highlands of Ethiopia.'
		},
		'yemeni-mocha': {
			name: 'Yemeni Mocha',
			image: '/images/bag2.png',
			price: '$18.00',
			description: 'Earthy and complex with chocolate undertones from Yemen.'
		},
		'kenya-aa': {
			name: 'Kenya AA',
			image: '/images/bag3.png',
			price: '$17.50',
			description: 'Bright acidity with a smooth finish — a Kenyan favorite.'
		}
	};

  onMount(() => {
		product = productData[slug];
	});

  function addToCart() {
    if (!product) return;
    // Adapt legacy product object to cart item shape
    cart.addItem({ id: slug, name: product.name, price: Number((product.price || '0').replace(/\$/g, '')), image_url: product.image });
  }
</script>

<svelte:head>
	<title>{product?.name || 'Product'} | Shop Coffee | Something’s Brewing</title>
	<meta name="description" content={product?.description || ''} />
	<meta property="og:title" content={product?.name || ''} />
	<meta property="og:description" content={product?.description || ''} />
	<meta property="og:type" content="product" />
	<meta property="og:url" content={`https://www.somethingsbrewing.com/products/${slug}`} />
	<meta
		property="og:image"
		content={`https://www.somethingsbrewing.com${product?.image || '/images/default.png'}`}
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={product?.name || ''} />
	<meta name="twitter:description" content={product?.description || ''} />
	<link rel="canonical" href={`https://www.somethingsbrewing.com/products/${slug}`} />
</svelte:head>

{#if product}
	<section class="grid gap-10 p-10 md:grid-cols-2">
		<img src={product.image} alt={product.name} class="h-auto w-full rounded shadow-md" />
		<div>
			<h1 class="mb-4 font-serif text-4xl">{product.name}</h1>
			<p class="text-accent mb-2 text-xl font-semibold">{product.price}</p>
			<p class="text-base-content mb-6">{product.description}</p>
      <button class="btn btn-primary" on:click={addToCart}>Add to Cart</button>
		</div>
	</section>
{:else}
	<p class="text-error p-10 text-center">Product not found.</p>
{/if}
