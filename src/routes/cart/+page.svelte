<!-- File: src/routes/cart/+page.svelte -->
<!-- Shopping cart page with centralized state management -->

<script>
	import { onMount } from 'svelte';
	import { cart, cartTotal, cartItemCount } from '$lib/stores/cart.js';

	let cartItems = [];
	let total = 0;
	let itemCount = 0;

	// Subscribe to cart store
	$: cartItems = $cart;
	$: total = $cartTotal;
	$: itemCount = $cartItemCount;

	// Initialize cart on mount
	onMount(() => {
		cart.init();
	});

	// Cart actions
	function removeItem(id) {
		cart.removeItem(id);
	}

	function updateQuantity(id, newQuantity) {
		cart.updateQuantity(id, newQuantity);
	}

	function increaseQuantity(id) {
		const item = cartItems.find((item) => item.id === id);
		if (item) {
			cart.updateQuantity(id, item.quantity + 1);
		}
	}

	function decreaseQuantity(id) {
		const item = cartItems.find((item) => item.id === id);
		if (item && item.quantity > 1) {
			cart.updateQuantity(id, item.quantity - 1);
		}
	}

	function clearCart() {
		cart.clear();
	}
</script>

<svelte:head>
	<title>Your Cart - Something's Brewing</title>
	<meta name="description" content="Review your coffee selection and proceed to checkout" />
</svelte:head>

<main>
<section class="mx-auto max-w-4xl space-y-6 p-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Your Cart</h1>
		{#if cartItems.length > 0}
			<div class="badge badge-primary badge-lg">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
		{/if}
	</div>

	{#if cartItems.length === 0}
		<div class="py-16 text-center">
			<div class="mb-4 text-6xl">☕</div>
			<h2 class="mb-4 text-2xl font-bold">Your cart is empty</h2>
			<p class="mb-8 text-lg opacity-70">
				Looks like you haven't added any delicious coffee to your cart yet.
			</p>
			<div class="space-x-4">
				<a href="/products" class="btn btn-primary btn-lg">Shop Coffee</a>
				<a href="/brew-guide" class="btn btn-outline btn-lg">Learn Brewing</a>
			</div>
		</div>
	{:else}
		<div class="space-y-6">
			<!-- Cart Items -->
			<div class="space-y-4">
				{#each cartItems as item (item.id)}
					<div class="card bg-base-200 p-6">
						<div class="flex flex-col gap-4 md:flex-row md:items-center">
							<!-- Product Image -->
							<div class="flex-shrink-0">
								<img
									src={item.image_url}
									alt={item.name}
									class="h-24 w-24 rounded-lg object-cover md:h-32 md:w-32"
									loading="lazy"
								/>
							</div>

							<!-- Product Details -->
							<div class="flex-1 space-y-2">
								<h3 class="text-xl font-semibold">{item.name}</h3>
								<p class="text-primary text-lg font-bold">${item.price.toFixed(2)} each</p>
								<p class="opacity-70">
									Subtotal: ${(item.price * item.quantity).toFixed(2)}
								</p>
							</div>

							<!-- Quantity Controls -->
							<div class="flex items-center gap-4">
								<div class="flex items-center gap-2">
									<button
										class="btn btn-sm btn-circle btn-outline"
										on:click={() => decreaseQuantity(item.id)}
										disabled={item.quantity <= 1}
										aria-label="Decrease quantity"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M20 12H4"
											/>
										</svg>
									</button>

									<input
										type="number"
										class="input input-bordered input-sm w-16 text-center"
										min="1"
										max="99"
										bind:value={item.quantity}
										on:change={() => updateQuantity(item.id, item.quantity)}
									/>

									<button
										class="btn btn-sm btn-circle btn-outline"
										on:click={() => increaseQuantity(item.id)}
										aria-label="Increase quantity"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 4v16m8-8H4"
											/>
										</svg>
									</button>
								</div>

								<button
									class="btn btn-sm btn-error btn-outline"
									on:click={() => removeItem(item.id)}
									aria-label="Remove item from cart"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
									Remove
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Cart Summary -->
			<div class="card bg-base-100 p-6">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div class="space-y-2">
						<div class="flex items-center justify-between text-lg">
							<span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
							<span class="font-bold">${total.toFixed(2)}</span>
						</div>
						<div class="flex items-center justify-between text-sm opacity-70">
							<span>Shipping</span>
							<span>Calculated at checkout</span>
						</div>
						<div class="flex items-center justify-between text-sm opacity-70">
							<span>Tax</span>
							<span>Calculated at checkout</span>
						</div>
						<div class="divider my-2"></div>
						<div class="flex items-center justify-between text-xl font-bold">
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>
					</div>

					<div class="flex flex-col gap-3 md:flex-row">
						<button class="btn btn-outline" on:click={clearCart} aria-label="Clear entire cart">
							Clear Cart
						</button>
						<a href="/products" class="btn btn-outline"> Continue Shopping </a>
						<a href="/checkout" class="btn btn-primary btn-lg"> Proceed to Checkout </a>
					</div>
				</div>
			</div>

			<!-- Additional Information -->
			<div class="grid gap-4 md:grid-cols-3">
				<div class="card bg-base-100 p-4 text-center">
					<div class="mb-2 text-2xl">🚚</div>
					<h3 class="mb-1 font-semibold">Free Shipping</h3>
					<p class="text-sm opacity-70">On orders over $50</p>
				</div>
				<div class="card bg-base-100 p-4 text-center">
					<div class="mb-2 text-2xl">🔒</div>
					<h3 class="mb-1 font-semibold">Secure Checkout</h3>
					<p class="text-sm opacity-70">SSL encrypted payment</p>
				</div>
				<div class="card bg-base-100 p-4 text-center">
					<div class="mb-2 text-2xl">↩️</div>
					<h3 class="mb-1 font-semibold">Easy Returns</h3>
					<p class="text-sm opacity-70">30-day return policy</p>
				</div>
			</div>

			<!-- Recommended Products -->
			<div class="card bg-base-100 p-6">
				<h2 class="mb-4 text-xl font-bold">You might also like</h2>
				<div class="text-center opacity-70">
					<p>Recommended products will appear here based on your cart items.</p>
					<a href="/products" class="btn btn-sm btn-outline mt-2">Browse All Products</a>
				</div>
			</div>
		</div>
	{/if}
</section>
</main>
