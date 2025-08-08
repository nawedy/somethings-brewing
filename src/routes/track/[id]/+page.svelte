<!-- File: src/routes/track/[id]/+page.svelte -->
<!-- Public order tracking page -->

<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import OrderTracking from '$lib/components/OrderTracking.svelte';

	let order = null;
	let loading = true;
	let error = '';
	let trackingData = null;

	$: orderId = $page.params.id;

	onMount(() => {
		loadOrderTracking();
	});

	async function loadOrderTracking() {
		loading = true;
		error = '';

		try {
			// Get basic order info (public data only)
			const orderResponse = await fetch(`/api/orders/${orderId}`);
			const orderResult = await orderResponse.json();

			if (orderResult.success) {
				order = {
					id: orderResult.order.id,
					status: orderResult.order.status,
					created_at: orderResult.order.created_at,
					total_price: orderResult.order.total_price,
					tracking_number: orderResult.order.tracking_number,
					shipping_carrier: orderResult.order.shipping_carrier
				};
			}

			// Get tracking information
			const trackingResponse = await fetch(`/api/orders/${orderId}/tracking`);
			const trackingResult = await trackingResponse.json();

			if (trackingResult.success) {
				trackingData = trackingResult.tracking;
			} else {
				error = trackingResult.error || 'Failed to load tracking information';
			}
		} catch (err) {
			console.error('Error loading tracking:', err);
			error = 'Failed to load tracking information';
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	{#if order}
		<title>Track Order #{order.id.slice(-8).toUpperCase()} - Something's Brewing</title>
		<meta name="description" content="Track your coffee order delivery status" />
	{:else}
		<title>Track Your Order - Something's Brewing</title>
	{/if}
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6 p-6">
	{#if loading}
		<div class="flex min-h-96 items-center justify-center">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if error}
		<div class="py-12 text-center">
			<div class="mb-4 text-6xl">📦</div>
			<h1 class="mb-4 text-3xl font-bold">Tracking Not Available</h1>
			<p class="mb-8 text-lg">{error}</p>
			<div class="space-x-4">
				<a href="/contact" class="btn btn-outline">Contact Support</a>
				<a href="/" class="btn btn-primary">Go Home</a>
			</div>
		</div>
	{:else}
		<!-- Header -->
		<div class="text-center">
			<h1 class="mb-4 text-3xl font-bold">Track Your Order</h1>
			{#if order}
				<div class="mb-2">
					<span class="text-lg font-semibold">Order #{order.id.slice(-8).toUpperCase()}</span>
				</div>
				<p class="opacity-70">Placed on {formatDate(order.created_at)}</p>
			{/if}
		</div>

		<!-- Order Tracking -->
		<div class="mx-auto max-w-2xl">
			<OrderTracking {orderId} {trackingData} />
		</div>

		<!-- Additional Information -->
		<div class="grid gap-6 md:grid-cols-2">
			<div class="card bg-base-100 p-6">
				<h3 class="mb-4 text-xl font-bold">Delivery Information</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="opacity-70">Estimated Delivery:</span>
						<span>3-5 business days</span>
					</div>
					<div class="flex justify-between">
						<span class="opacity-70">Shipping Method:</span>
						<span>Standard Shipping</span>
					</div>
					{#if trackingData?.tracking_number}
						<div class="flex justify-between">
							<span class="opacity-70">Tracking Number:</span>
							<span class="font-mono">{trackingData.tracking_number}</span>
						</div>
					{/if}
					{#if trackingData?.shipping_carrier}
						<div class="flex justify-between">
							<span class="opacity-70">Carrier:</span>
							<span>{trackingData.shipping_carrier}</span>
						</div>
					{/if}
				</div>
			</div>

			<div class="card bg-base-100 p-6">
				<h3 class="mb-4 text-xl font-bold">Need Help?</h3>
				<p class="mb-4 text-sm">
					If you have any questions about your order or delivery, our support team is here to help.
				</p>
				<div class="space-y-2">
					<div class="flex items-center gap-2 text-sm">
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
								d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<span>support@somethingsbrewing.com</span>
					</div>
					<div class="flex items-center gap-2 text-sm">
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
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						<span>(555) 123-4567</span>
					</div>
				</div>
				<a href="/contact" class="btn btn-sm btn-outline mt-4 w-full">Contact Support</a>
			</div>
		</div>

		<!-- Continue Shopping -->
		<div class="text-center">
			<div class="bg-primary/10 rounded-lg p-6">
				<h3 class="mb-2 text-xl font-bold">Love Your Coffee?</h3>
				<p class="mb-4 opacity-70">
					Discover more amazing coffee blends and brewing accessories in our shop.
				</p>
				<a href="/products" class="btn btn-primary">Continue Shopping</a>
			</div>
		</div>
	{/if}
</div>
