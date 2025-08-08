<!-- File: src/lib/components/OrderTracking.svelte -->
<!-- Order tracking timeline component -->

<script>
	export let orderId;
	export let trackingData = null;

	import { onMount } from 'svelte';

	let loading = true;
	let error = '';
	let tracking = null;

	// Status icons mapping
	const statusIcons = {
		pending: '⏳',
		paid: '💳',
		processing: '📦',
		shipped: '🚚',
		in_transit: '🛣️',
		out_for_delivery: '🚛',
		delivered: '✅',
		cancelled: '❌',
		payment_failed: '⚠️'
	};

	// Status descriptions
	const statusDescriptions = {
		pending: 'Order placed and awaiting payment',
		paid: 'Payment received successfully',
		processing: 'Order is being prepared for shipment',
		shipped: 'Order has been shipped',
		in_transit: 'Package is in transit',
		out_for_delivery: 'Out for delivery',
		delivered: 'Package delivered successfully',
		cancelled: 'Order has been cancelled',
		payment_failed: 'Payment processing failed'
	};

	onMount(async () => {
		if (trackingData) {
			tracking = trackingData;
			loading = false;
			return;
		}

		if (!orderId) {
			error = 'Order ID is required';
			loading = false;
			return;
		}

		try {
			const response = await fetch(`/api/orders/${orderId}/tracking`);
			const result = await response.json();

			if (result.success) {
				tracking = result.tracking;
			} else {
				error = result.error || 'Failed to load tracking information';
			}
		} catch (err) {
			console.error('Error fetching tracking:', err);
			error = 'Failed to load tracking information';
		} finally {
			loading = false;
		}
	});

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatTime(dateString) {
		return new Date(dateString).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="card bg-base-100 p-6">
	<h2 class="mb-6 text-xl font-bold">Order Tracking</h2>

	{#if loading}
		<div class="flex items-center justify-center py-8">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if error}
		<div class="alert alert-error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{error}</span>
		</div>
	{:else if tracking}
		<!-- Current Status -->
		<div class="bg-primary/10 mb-6 rounded-lg p-4">
			<div class="flex items-center gap-3">
				<div class="text-2xl">{statusIcons[tracking.current_status] || '📦'}</div>
				<div>
					<h3 class="font-semibold capitalize">
						{tracking.current_status.replace('_', ' ')}
					</h3>
					<p class="text-sm opacity-70">
						{statusDescriptions[tracking.current_status] || 'Status updated'}
					</p>
				</div>
			</div>

			{#if tracking.tracking_number}
				<div class="mt-3 flex items-center gap-2 text-sm">
					<span class="opacity-70">Tracking Number:</span>
					<span class="font-mono font-semibold">{tracking.tracking_number}</span>
					{#if tracking.shipping_carrier}
						<span class="badge badge-outline">{tracking.shipping_carrier}</span>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Tracking Timeline -->
		{#if tracking.history && tracking.history.length > 0}
			<div class="space-y-4">
				<h3 class="font-semibold">Tracking History</h3>
				<div class="relative">
					{#each tracking.history as event, index}
						<div class="flex gap-4 pb-6">
							<!-- Timeline Line -->
							<div class="relative flex flex-col items-center">
								<div
									class="bg-base-100 flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg {index ===
									0
										? 'border-primary bg-primary text-primary-content'
										: 'border-base-300'}"
								>
									{statusIcons[event.status] || '📦'}
								</div>
								{#if index < tracking.history.length - 1}
									<div class="bg-base-300 mt-2 h-full w-0.5"></div>
								{/if}
							</div>

							<!-- Event Details -->
							<div class="flex-1 pb-4">
								<div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
									<h4 class="font-semibold capitalize">
										{event.status.replace('_', ' ')}
									</h4>
									<span class="text-sm opacity-70">{formatDate(event.created_at)}</span>
								</div>

								<p class="text-sm opacity-70">
									{statusDescriptions[event.status] || 'Status updated'}
								</p>

								{#if event.notes}
									<p class="mt-1 text-sm">{event.notes}</p>
								{/if}

								{#if event.location}
									<div class="mt-2 flex items-center gap-1 text-sm opacity-70">
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
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										<span>{event.location}</span>
									</div>
								{/if}

								{#if event.tracking_number && event.tracking_number !== tracking.tracking_number}
									<div class="mt-1 text-sm">
										<span class="opacity-70">Tracking:</span>
										<span class="font-mono">{event.tracking_number}</span>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="py-8 text-center opacity-70">
				<p>No tracking history available yet.</p>
			</div>
		{/if}

		<!-- Estimated Delivery -->
		{#if tracking.current_status === 'shipped' || tracking.current_status === 'in_transit'}
			<div class="bg-info/10 mt-6 rounded-lg p-4">
				<h3 class="mb-2 font-semibold">Estimated Delivery</h3>
				<p class="text-sm">
					Your order is expected to arrive within 3-5 business days from the ship date.
				</p>
			</div>
		{/if}
	{/if}
</div>
