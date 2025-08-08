<!-- File: src/components/FeaturedProducts.svelte -->
<!-- Purpose: Carousel-based featured product showcase with DaisyUI -->

<script>
	let products = [
		{
			name: 'Golden Roast',
			description: 'Explore rich caramel and chocolate notes.',
			image: '/images/bag1.png'
		},
		{
			name: 'Bold Espresso',
			description: 'Intense and deep with creamy crema.',
			image: '/images/bag2.png'
		},
		{
			name: 'Loyalty Reserve',
			description: 'Exclusive blend for members only.',
			image: '/images/bag3.png'
		}
	];
</script>

<section class="bg-base-200 px-6 py-16">
	<h2 class="mb-10 text-center font-serif text-4xl">Featured Products</h2>
	<div class="carousel w-full">
		{#each products as product, i}
			<div class="carousel-item w-full justify-center px-4">
				<div class="card bg-base-100 w-80 shadow-xl">
					<figure><img src={product.image} alt={product.name} /></figure>
					<div class="card-body">
						<h3 class="card-title">{product.name}</h3>
						<p>{product.description}</p>
						<div class="card-actions justify-end">
							<button class="btn btn-sm btn-primary">Buy Now</button>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
