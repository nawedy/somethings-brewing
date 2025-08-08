<!-- File: src/routes/account/orders/+page.svelte -->
<!-- Customer order history page -->

<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.js';
	import OrderCard from '$lib/components/OrderCard.svelte';

	let orders = [];
	let loading = true;
	let error = '';
	let currentPage = 1;
	let totalPages = 1;
	let statusFilter = '';
	let user = null;

	// Subscribe to auth store
	$: user = $auth.user;

	onMount(async () => {
		await auth.init();
		if (user) {
			loadOrders();
		}
	});

	async function loadOrders() {
		loading = true;
		error = '';

		try {
			const params = new URLSearchParams({
				customer_id: user.id,
				page: currentPage.toString(),
				limit: '10'
			});

			if (statusFilter) {
				params.append('status', statusFilter);
			}

			const response = await fetch(`/api/orders?${params}`);
			const result = await response.json();

			if (result.success) {
				orders = result.orders;
				totalPages = result.pagination.total_pages;
			} else {
				error = result.error || 'Failed to load orders';
			}
		} catch (err) {
			console.error('Error loading orders:', err);
			error = 'Failed to load orders';
		} finally {
			loading = false;
		}
	}

	function handleStatusFilter(event) {
		statusFilter = event.target.value;
		currentPage = 1;
		loadOrders();
	}

	function handlePageChange(newPage) {
		currentPage = newPage;
		loadOrders();
	}

	// Reactive updates
	$: if (user) {
		loadOrders();
	}
</script>

<svelte:head>
	<title>My Orders - Something's Brewing</title>
	<meta name="description" content="View your order history and track your coffee orders" />
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6 p-6">
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<h1 class="text-3xl font-bold">My Orders</h1>

		<!-- Filter Controls -->
		<div class="flex gap-3">
			<select class="select select-bordered" on:change={handleStatusFilter}>
				<option value="">All Orders</option>
				<option value="pending">Pending</option>
				<option value="paid">Paid</option>
				<option value="processing">Processing</option>
				<option value="shipped">Shipped</option>
				<option value="delivered">Delivered</option>
				<option value="cancelled">Cancelled</option>
			</select>
		</div>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
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
	{:else if orders.length === 0}
		<div class="py-16 text-center">
			<div class="mb-4 text-6xl">📦</div>
			<h2 class="mb-4 text-2xl font-bold">No orders yet</h2>
			<p class="mb-8 text-lg opacity-70">
				You haven't placed any orders yet. Start shopping to see your orders here.
			</p>
			<a href="/products" class="btn btn-primary btn-lg">Shop Coffee</a>
		</div>
	{:else}
		<!-- Orders List -->
		<div class="space-y-4">
			{#each orders as order (order.id)}
				<OrderCard {order} showTracking={true} />
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex justify-center">
				<div class="join">
					<button
						class="btn join-item"
						class:btn-disabled={currentPage === 1}
						on:click={() => handlePageChange(currentPage - 1)}
					>
						Previous
					</button>

					{#each Array(totalPages) as _, index}
						{@const pageNum = index + 1}
						<button
							class="btn join-item"
							class:btn-active={currentPage === pageNum}
							on:click={() => handlePageChange(pageNum)}
						>
							{pageNum}
						</button>
					{/each}

					<button
						class="btn join-item"
						class:btn-disabled={currentPage === totalPages}
						on:click={() => handlePageChange(currentPage + 1)}
					>
						Next
					</button>
				</div>
			</div>
		{/if}

		<!-- Order Summary Stats -->
		<div class="grid gap-4 md:grid-cols-3">
			<div class="card bg-base-200 p-4 text-center">
				<div class="mb-2 text-2xl">📊</div>
				<h3 class="mb-1 font-semibold">Total Orders</h3>
				<p class="text-lg font-bold">{orders.length}</p>
			</div>
			<div class="card bg-base-200 p-4 text-center">
				<div class="mb-2 text-2xl">💰</div>
				<h3 class="mb-1 font-semibold">Total Spent</h3>
				<p class="text-lg font-bold">
					${orders.reduce((sum, order) => sum + order.total_price, 0).toFixed(2)}
				</p>
			</div>
			<div class="card bg-base-200 p-4 text-center">
				<div class="mb-2 text-2xl">☕</div>
				<h3 class="mb-1 font-semibold">Items Ordered</h3>
				<p class="text-lg font-bold">
					{orders.reduce((sum, order) => sum + (order.summary?.item_count || 0), 0)}
				</p>
			</div>
		</div>
	{/if}
</div>
