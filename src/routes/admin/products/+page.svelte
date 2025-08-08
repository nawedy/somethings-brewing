<!-- Admin product manager -->

<script>
  import ProductEditor from '$components/ProductEditor.svelte';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase.js';

  let products = [];
  let selected = null;
  let loading = true;
  let error = '';
  let token = '';

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    token = data?.session?.access_token || '';
    await loadProducts();
  });

  async function loadProducts() {
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/products');
      const result = await res.json();
      if (result.success) products = result.products;
      else error = result.error || 'Failed to load products';
    } catch (e) {
      error = 'Failed to load products';
    } finally {
      loading = false;
    }
  }

  function editProduct(p) {
    selected = { ...p };
  }

  async function handleSave(updated) {
    try {
      const method = updated.id ? 'PUT' : 'POST';
      const url = updated.id ? `/api/products/${updated.id}` : '/api/products';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(updated)
      });
      const result = await res.json();
      if (result.success) {
        selected = null;
        await loadProducts();
      } else {
        alert(result.error || 'Failed to save product');
      }
    } catch (e) {
      alert('Failed to save product');
    }
  }
</script>

<section class="space-y-6 p-8">
	<h1 class="text-2xl font-bold">Manage Products</h1>

  {#if loading}
    <div class="py-12 text-center"><span class="loading loading-spinner loading-lg"></span></div>
  {:else if error}
    <div class="alert alert-error">{error}</div>
  {:else}
    {#if selected}
      <ProductEditor bind:product={selected} on:save={handleSave} />
    {:else}
      <button
        class="btn btn-primary"
        on:click={() => (selected = { name: '', price: 0, description: '', tags: '', image_url: '', available: true, stock: 0 })}
      >
        + Add New Product
      </button>

      <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {#each products as p}
          <div class="card bg-base-100 p-4 shadow">
            <img src={p.image_url} alt={p.name} class="h-40 rounded object-cover" />
            <h2 class="mt-2 font-bold">{p.name}</h2>
            <p class="text-sm">${p.price} • Stock: {p.stock ?? 0} • {p.available ? 'Available' : 'Unavailable'}</p>
            <button class="btn btn-sm mt-2" on:click={() => editProduct(p)}>Edit</button>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</section>
