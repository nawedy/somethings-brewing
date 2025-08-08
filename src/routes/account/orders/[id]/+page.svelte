<!-- File: src/routes/account/orders/[id]/+page.svelte -->
<!-- Individual order details page for customers -->

<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth.js';
	import OrderTracking from '$lib/components/OrderTracking.svelte';

	let order = null;
	let loading = true;
	let error = '';
	let user = null;

	$: orderId = $page.params.id;
	$: user = $auth.user;

	onMount(async () => {
		await auth.init();
		if (user) {
			loadOrder();
		}
	});

	async function loadOrder() {
		loading = true;
		error = '';

		try {
			const response = await fetch(`/api/orders/${orderId}?include_tracking=true`);
			const result = await response.json();

			if (result.success) {
				// Verify this order belongs to the current user
				if (result.order.customer.id !== user.id) {
					error = 'Access denied';
					return;
				}
				order = result.order;
			} else {
				error = result.error || 'Failed to load order';
			}
		} catch (err) {
			console.error('Error loading order:', err);
			error = 'Failed to load order';
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function printOrder() {
		window.print();
	}

	// Status color mapping
	const statusColors = {
		pending: 'badge-warning',
		paid: 'badge-info',
		processing: 'badge-primary',
		shipped: 'badge-success',
		delivered: 'badge-success',
		cancelled: 'badge-error',
		payment_failed: 'badge-error'
	};
</script>

<svelte:head>
	{#if order}
		<title>Order #{order.id.slice(-8).toUpperCase()} - Something's Brewing</title>
		<meta name="description" content="View details for your coffee order" />
	{:else}
		<title>Order Details - Something's Brewing</title>
	{/if}
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6 p-6">
	{#if loading}
		<div class="flex min-h-96 items-center justify-center">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if error}
		<div class="py-12 text-center">
			<div class="mb-4 text-6xl">❌</div>
			<h1 class="mb-4 text-3xl font-bold">Order Not Found</h1>
			<p class="mb-8 text-lg">{error}</p>
			<a href="/account/orders" class="btn btn-primary">Back to Orders</a>
		</div>
	{:else if order}
		<!-- Header -->
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<div class="mb-2 flex items-center gap-3">
					<h1 class="text-3xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h1>
					<div class="badge badge-lg {statusColors[order.status] || 'badge-neutral'}">
						{order.status}
					</div>
				</div>
				<p class="opacity-70">Placed on {formatDate(order.created_at)}</p>
			</div>

			<div class="flex gap-3">
				<button class="btn btn-outline" on:click={printOrder}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
						/>
					</svg>
					Print Order
				</button>
				<a href="/account/orders" class="btn btn-outline">Back to Orders</a>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Order Details -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Order Items -->
				<div class="card bg-base-100 p-6">
					<h2 class="mb-4 text-xl font-bold">Order Items</h2>
					<div class="space-y-4">
						{#each order.items as item}
							<div class="flex items-center gap-4">
								{#if item.products?.image_url}
									<img
										src={item.products.image_url}
										alt={item.products.name}
										class="h-16 w-16 rounded object-cover"
									/>
								{/if}
								<div class="flex-1">
									<h3 class="font-semibold">{item.products?.name || 'Product'}</h3>
									<p class="text-sm opacity-70">Quantity: {item.quantity}</p>
									<p class="text-sm opacity-70">${item.unit_price.toFixed(2)} each</p>
								</div>
								<div class="text-right">
									<p class="font-semibold">${(item.quantity * item.unit_price).toFixed(2)}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Order Tracking -->
				{#if order.tracking}
					<OrderTracking {orderId} trackingData={order.tracking} />
				{/if}
			</div>

			<!-- Order Summary -->
			<div class="space-y-6">
				<div class="card bg-base-100 p-6">
					<h2 class="mb-4 text-xl font-bold">Order Summary</h2>
					<div class="space-y-3">
						<div class="flex justify-between">
							<span>Subtotal ({order.summary.item_count} items)</span>
							<span>${order.summary.subtotal.toFixed(2)}</span>
						</div>
						<div class="flex justify-between">
							<span>Shipping</span>
							<span
								>{order.summary.shipping > 0
									? `$${order.summary.shipping.toFixed(2)}`
									: 'Free'}</span
							>
						</div>
						<div class="flex justify-between">
							<span>Tax</span>
							<span>${order.summary.tax.toFixed(2)}</span>
						</div>
						<div class="divider my-2"></div>
						<div class="flex justify-between text-lg font-bold">
							<span>Total</span>
							<span>${order.total_price.toFixed(2)}</span>
						</div>
					</div>
				</div>

				<!-- Customer Information -->
				<div class="card bg-base-100 p-6">
					<h2 class="mb-4 text-xl font-bold">Customer Information</h2>
					<div class="space-y-2 text-sm">
						<div>
							<span class="opacity-70">Name:</span>
							<span class="ml-2">{order.customer.full_name || 'N/A'}</span>
						</div>
						<div>
							<span class="opacity-70">Email:</span>
							<span class="ml-2">{order.customer.email}</span>
						</div>
					</div>
				</div>

				<!-- Tracking Information -->
				{#if order.tracking_number}
					<div class="card bg-base-100 p-6">
						<h2 class="mb-4 text-xl font-bold">Shipping Information</h2>
						<div class="space-y-2 text-sm">
							<div>
								<span class="opacity-70">Tracking Number:</span>
								<span class="ml-2 font-mono">{order.tracking_number}</span>
							</div>
							{#if order.shipping_carrier}
								<div>
									<span class="opacity-70">Carrier:</span>
									<span class="ml-2">{order.shipping_carrier}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Need Help -->
				<div class="card bg-base-200 p-6">
					<h2 class="mb-4 text-xl font-bold">Need Help?</h2>
					<p class="mb-4 text-sm">
						If you have any questions about your order, we're here to help.
					</p>
					<div class="space-y-2">
						<a href="/contact" class="btn btn-sm btn-outline w-full">Contact Support</a>
						<a href="/products" class="btn btn-sm btn-primary w-full">Shop Again</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
    @media print {
        .btn {
            display: none !important;
        }
    }
</style>
