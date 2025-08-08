<!-- File: src/components/ProductCard.svelte -->
<!-- Purpose: Reusable product display card with name, price, image, and CTA -->

<script>
	export let product;
</script>

<a
	href={`/products/${product.slug}`}
	class="card bg-base-100 w-full shadow-md transition hover:shadow-xl"
>
	<figure><img src={product.image} alt={product.name} class="h-48 w-full object-cover" /></figure>
	<div class="card-body">
		<h2 class="card-title">{product.name}</h2>
		<p class="text-lg font-semibold">{product.price}</p>
		<div class="card-actions justify-end">
			<button class="btn btn-sm btn-primary">View</button>
		</div>
	</div>
</a>
