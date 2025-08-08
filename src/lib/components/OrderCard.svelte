<!-- File: src/lib/components/OrderCard.svelte -->
<!-- Reusable order card component for displaying order information -->

<script>
	export let order;
	export let showTracking = false;
	export let isAdmin = false;

	import { goto } from '$app/navigation';

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

	// Status descriptions
	const statusDescriptions = {
		pending: 'Awaiting payment',
		paid: 'Payment received',
		processing: 'Being prepared',
		shipped: 'On the way',
		delivered: 'Delivered',
		cancelled: 'Cancelled',
		payment_failed: 'Payment failed'
	};

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function viewOrderDetails() {
		if (isAdmin) {
			goto(`/admin/orders/${order.id}`);
		} else {
			goto(`/account/orders/${order.id}`);
		}
	}

	function trackOrder() {
		goto(`/track/${order.id}`);
	}
</script>

<div class="card bg-base-100 p-6 shadow-sm">
	<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<!-- Order Header -->
		<div class="flex-1">
			<div class="mb-2 flex items-center gap-3">
				<h3 class="text-lg font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h3>
				<div class="badge {statusColors[order.status] || 'badge-neutral'}">
					{statusDescriptions[order.status] || order.status}
				</div>
			</div>

			<div class="mb-3 text-sm opacity-70">
				<p>Placed on {formatDate(order.created_at)}</p>
				{#if order.customers && isAdmin}
					<p>Customer: {order.customers.full_name || order.customers.email}</p>
				{/if}
				{#if order.tracking_number}
					<p>Tracking: {order.tracking_number}</p>
				{/if}
			</div>

			<!-- Order Items Preview -->
			<div class="mb-4">
				<div class="flex flex-wrap gap-2">
					{#each order.order_items.slice(0, 3) as item}
						<div class="bg-base-200 flex items-center gap-2 rounded p-2 text-sm">
							{#if item.products?.image_url}
								<img
									src={item.products.image_url}
									alt={item.products.name}
									class="h-8 w-8 rounded object-cover"
								/>
							{/if}
							<span>{item.quantity}x {item.products?.name || 'Product'}</span>
						</div>
					{/each}
					{#if order.order_items.length > 3}
						<div class="bg-base-200 flex items-center rounded p-2 text-sm opacity-70">
							+{order.order_items.length - 3} more
						</div>
					{/if}
				</div>
			</div>

			<!-- Order Summary -->
			<div class="text-sm">
				<div class="flex justify-between">
					<span class="opacity-70">{order.summary?.item_count || 0} items</span>
					<span class="font-semibold">${order.total_price.toFixed(2)}</span>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex flex-col gap-2 md:flex-row">
			<button class="btn btn-outline btn-sm" on:click={viewOrderDetails}>
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
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
					/>
				</svg>
				View Details
			</button>

			{#if showTracking && (order.status === 'shipped' || order.status === 'delivered' || order.tracking_number)}
				<button class="btn btn-primary btn-sm" on:click={trackOrder}>
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
					Track Order
				</button>
			{/if}
		</div>
	</div>

	<!-- Progress Bar for Shipped Orders -->
	{#if order.status === 'shipped' || order.status === 'delivered'}
		<div class="mt-4">
			<div class="mb-2 text-sm font-medium">Order Progress</div>
			<div class="flex items-center gap-2">
				<div class="flex-1">
					<progress
						class="progress progress-primary"
						value={order.status === 'delivered' ? 100 : 75}
						max="100"
					></progress>
				</div>
				<span class="text-sm opacity-70">
					{order.status === 'delivered' ? 'Delivered' : 'In Transit'}
				</span>
			</div>
		</div>
	{/if}
</div>
