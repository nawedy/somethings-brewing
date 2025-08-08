<!-- File: src/routes/admin/orders/+page.svelte -->
<!-- Admin order management page -->

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
	let searchTerm = '';
	let user = null;
	let isAdmin = false;

	// Order statistics
	let stats = {
		total: 0,
		pending: 0,
		processing: 0,
		shipped: 0,
		delivered: 0,
		revenue: 0
	};

	// Subscribe to auth store
	$: user = $auth.user;
	$: isAdmin = user?.role === 'admin';

	onMount(async () => {
		await auth.init();
		if (isAdmin) {
			loadOrders();
			loadStats();
		}
	});

	async function loadOrders() {
		loading = true;
		error = '';

		try {
			const params = new URLSearchParams({
				page: currentPage.toString(),
				limit: '20'
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

	async function loadStats() {
		try {
			// Load all orders for statistics
			const response = await fetch('/api/orders?limit=1000');
			const result = await response.json();

			if (result.success) {
				const allOrders = result.orders;
				stats = {
					total: allOrders.length,
					pending: allOrders.filter((o) => o.status === 'pending').length,
					processing: allOrders.filter((o) => o.status === 'processing').length,
					shipped: allOrders.filter((o) => o.status === 'shipped').length,
					delivered: allOrders.filter((o) => o.status === 'delivered').length,
					revenue: allOrders
						.filter((o) => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status))
						.reduce((sum, o) => sum + o.total_price, 0)
				};
			}
		} catch (err) {
			console.error('Error loading stats:', err);
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

	async function updateOrderStatus(orderId, newStatus) {
		try {
			const response = await fetch(`/api/orders/${orderId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: newStatus })
			});

			const result = await response.json();

			if (result.success) {
				// Reload orders and stats
				loadOrders();
				loadStats();
			} else {
				alert(`Failed to update order: ${result.error}`);
			}
		} catch (err) {
			console.error('Error updating order:', err);
			alert('Failed to update order');
		}
	}

	// Reactive updates
	$: if (isAdmin) {
		loadOrders();
	}
</script>

<svelte:head>
	<title>Order Management - Something's Brewing Admin</title>
	<meta name="description" content="Manage customer orders and track fulfillment" />
</svelte:head>

{#if !isAdmin}
	<div class="py-12 text-center">
		<h1 class="mb-4 text-3xl font-bold">Access Denied</h1>
		<p class="mb-8">You don't have permission to access this page.</p>
		<a href="/" class="btn btn-primary">Go Home</a>
	</div>
{:else}
	<div class="mx-auto max-w-7xl space-y-6 p-6">
		<!-- Header -->
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<h1 class="text-3xl font-bold">Order Management</h1>

			<!-- Filter Controls -->
			<div class="flex gap-3">
				<input
					type="search"
					placeholder="Search orders..."
					class="input input-bordered"
					bind:value={searchTerm}
				/>
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

		<!-- Statistics -->
		<div class="grid gap-4 md:grid-cols-5">
			<div class="card bg-base-100 p-4 text-center">
				<div class="mb-2 text-2xl">📦</div>
				<h3 class="mb-1 font-semibold">Total Orders</h3>
				<p class="text-xl font-bold">{stats.total}</p>
			</div>
			<div class="card bg-base-100 p-4 text-center">
				<div class="mb-2 text-2xl">⏳</div>
				<h3 class="mb-1 font-semibold">Pending</h3>
				<p class="text-warning text-xl font-bold">{stats.pending}</p>
			</div>
			<div class="card bg-base-100 p-4 text-center">
				<div class="mb-2 text-2xl">🔄</div>
				<h3 class="mb-1 font-semibold">Processing</h3>
				<p class="text-info text-xl font-bold">{stats.processing}</p>
			</div>
			<div class="card bg-base-100 p-4 text-center">
				<div class="mb-2 text-2xl">🚚</div>
				<h3 class="mb-1 font-semibold">Shipped</h3>
				<p class="text-primary text-xl font-bold">{stats.shipped}</p>
			</div>
			<div class="card bg-base-100 p-4 text-center">
				<div class="mb-2 text-2xl">💰</div>
				<h3 class="mb-1 font-semibold">Revenue</h3>
				<p class="text-success text-xl font-bold">${stats.revenue.toFixed(2)}</p>
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
				<h2 class="mb-4 text-2xl font-bold">No orders found</h2>
				<p class="text-lg opacity-70">
					{statusFilter
						? `No orders with status "${statusFilter}"`
						: 'No orders have been placed yet'}
				</p>
			</div>
		{:else}
			<!-- Orders List -->
			<div class="space-y-4">
				{#each orders as order (order.id)}
					<div class="relative">
						<OrderCard {order} isAdmin={true} />

						<!-- Quick Actions -->
						<div class="absolute top-4 right-4">
							<div class="dropdown dropdown-end">
                                <button type="button" class="btn btn-circle btn-ghost btn-sm" aria-haspopup="menu" aria-expanded="false">
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
											d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
										/>
									</svg>
                                </button>
                                <ul class="menu dropdown-content rounded-box bg-base-100 z-[1] w-52 p-2 shadow" role="menu">
									{#if order.status === 'paid'}
										<li>
											<button on:click={() => updateOrderStatus(order.id, 'processing')}>
												Mark as Processing
											</button>
										</li>
									{/if}
									{#if order.status === 'processing'}
										<li>
											<button on:click={() => updateOrderStatus(order.id, 'shipped')}>
												Mark as Shipped
											</button>
										</li>
									{/if}
									{#if order.status === 'shipped'}
										<li>
											<button on:click={() => updateOrderStatus(order.id, 'delivered')}>
												Mark as Delivered
											</button>
										</li>
									{/if}
									{#if !['delivered', 'cancelled'].includes(order.status)}
										<li>
											<button
												class="text-error"
												on:click={() => updateOrderStatus(order.id, 'cancelled')}
											>
												Cancel Order
											</button>
										</li>
									{/if}
								</ul>
							</div>
						</div>
					</div>
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

						{#each Array(Math.min(totalPages, 10)) as _, index}
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
		{/if}
	</div>
{/if}
