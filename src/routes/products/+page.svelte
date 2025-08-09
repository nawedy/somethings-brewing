<!-- File: src/routes/products/+page.svelte -->
<!-- Purpose: Displays all available coffee products in a responsive grid -->

<script>
  import ProductCard from '$components/ProductCard.svelte';
  import { onMount } from 'svelte';
  import { cart } from '$lib/stores/cart.js';
  let products = [];

  onMount(async () => {
    try {
      const res = await fetch('/api/products');
      const result = await res.json();
      if (result.success) {
        products = result.products.map((p) => ({ slug: p.slug, name: p.name, image: p.image_url, price: `$${p.price.toFixed(2)}`, id: p.id }));
      }
      cart.init();
    } catch (e) {}
  });
</script>

<main>
  <section class="p-10">
      <h1 class="mb-8 text-center font-serif text-4xl">All Products</h1>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each products as product}
        <ProductCard {product} />
          {/each}
      </div>
  </section>
</main>
