<!-- File: src/routes/confirmation/+page.svelte -->
<!-- Order confirmation page after successful payment -->

<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let orderId = '';
	let paymentIntentId = '';
	let orderDetails = null;
	let loading = true;
	let error = '';

	// Get query parameters
	$: orderId = $page.url.searchParams.get('order_id') || '';
	$: paymentIntentId = $page.url.searchParams.get('payment_intent') || '';

	onMount(async () => {
		// Redirect to home if no order ID
		if (!orderId) {
			goto('/');
			return;
		}

		// TODO: Fetch order details from API
		// For now, show success message
		loading = false;
	});

	function printOrder() {
		window.print();
	}
</script>

<svelte:head>
	<title>Order Confirmation - Something's Brewing</title>
	<meta name="description" content="Your order has been confirmed" />
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	{#if loading}
		<div class="flex min-h-96 items-center justify-center">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if error}
		<div class="py-12 text-center">
			<div class="mb-4 text-6xl">❌</div>
			<h1 class="mb-4 text-3xl font-bold">Order Error</h1>
			<p class="mb-8 text-lg">{error}</p>
			<a href="/" class="btn btn-primary">Go Home</a>
		</div>
	{:else}
		<!-- Success Header -->
		<div class="py-8 text-center">
			<div class="mb-4 text-6xl">✅</div>
			<h1 class="text-success mb-4 text-4xl font-bold">Order Confirmed!</h1>
			<p class="mb-6 text-xl">
				Thank you for your order. We've received your payment and will start processing your order
				shortly.
			</p>
			<div class="badge badge-success badge-lg">Order #{orderId.slice(-8).toUpperCase()}</div>
		</div>

		<!-- Order Details Card -->
		<div class="card bg-base-100 mb-8 p-8">
			<div class="grid gap-8 md:grid-cols-2">
				<!-- Order Information -->
				<div>
					<h2 class="mb-4 text-2xl font-bold">Order Information</h2>
					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="opacity-70">Order Number:</span>
							<span class="font-medium">#{orderId.slice(-8).toUpperCase()}</span>
						</div>
						<div class="flex justify-between">
							<span class="opacity-70">Payment ID:</span>
							<span class="font-mono text-sm font-medium"
								>{paymentIntentId.slice(-8).toUpperCase()}</span
							>
						</div>
						<div class="flex justify-between">
							<span class="opacity-70">Order Date:</span>
							<span class="font-medium">{new Date().toLocaleDateString()}</span>
						</div>
						<div class="flex justify-between">
							<span class="opacity-70">Status:</span>
							<span class="badge badge-success">Confirmed</span>
						</div>
						<div class="flex justify-between">
							<span class="opacity-70">Payment Status:</span>
							<span class="badge badge-success">Paid</span>
						</div>
					</div>
				</div>

				<!-- Next Steps -->
				<div>
					<h2 class="mb-4 text-2xl font-bold">What's Next?</h2>
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<div class="badge badge-primary">1</div>
							<div>
								<h3 class="font-semibold">Order Processing</h3>
								<p class="text-sm opacity-70">
									We'll prepare your coffee order within 1-2 business days.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<div class="badge badge-primary">2</div>
							<div>
								<h3 class="font-semibold">Shipping Notification</h3>
								<p class="text-sm opacity-70">
									You'll receive a tracking number via email once shipped.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<div class="badge badge-primary">3</div>
							<div>
								<h3 class="font-semibold">Delivery</h3>
								<p class="text-sm opacity-70">Your order will arrive within 3-5 business days.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex flex-col gap-4 md:flex-row md:justify-center">
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
			<a href="/account/orders" class="btn btn-outline">
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
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				View All Orders
			</a>
			<a href="/products" class="btn btn-primary">
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
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
					/>
				</svg>
				Continue Shopping
			</a>
		</div>

		<!-- Additional Information -->
		<div class="mt-12 grid gap-6 md:grid-cols-2">
			<!-- Customer Support -->
			<div class="card bg-base-200 p-6">
				<h3 class="mb-4 text-xl font-bold">Need Help?</h3>
				<p class="mb-4">
					If you have any questions about your order, our customer support team is here to help.
				</p>
				<div class="space-y-2">
					<div class="flex items-center gap-2">
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
								d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<span>support@somethingsbrewing.com</span>
					</div>
					<div class="flex items-center gap-2">
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
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						<span>(555) 123-4567</span>
					</div>
				</div>
				<a href="/contact" class="btn btn-sm btn-outline mt-4">Contact Support</a>
			</div>

			<!-- Order Tracking -->
			<div class="card bg-base-200 p-6">
				<h3 class="mb-4 text-xl font-bold">Track Your Order</h3>
				<p class="mb-4">
					You'll receive an email with tracking information once your order ships. You can also
					track your order in your account.
				</p>
				<div class="space-y-2">
					<div class="flex items-center gap-2">
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
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Email confirmation sent</span>
					</div>
					<div class="flex items-center gap-2">
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
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Processing within 1-2 days</span>
					</div>
				</div>
				<a href="/account/orders" class="btn btn-sm btn-outline mt-4">View Order History</a>
			</div>
		</div>

		<!-- Social Sharing -->
		<div class="mt-12 text-center">
			<h3 class="mb-4 text-xl font-bold">Share Your Coffee Love</h3>
			<p class="mb-6 opacity-70">
				Tag us @somethingsbrewing when you receive your order for a chance to be featured!
			</p>
            <div class="flex justify-center gap-4">
                <a href="https://twitter.com/share" aria-label="Share on Twitter" class="btn btn-circle btn-outline">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
						/>
					</svg>
                </a>
                <a href="https://www.reddit.com/submit" aria-label="Share on Reddit" class="btn btn-circle btn-outline">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.751-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"
						/>
					</svg>
                </a>
                <a href="https://www.instagram.com/" aria-label="Share on Instagram" class="btn btn-circle btn-outline">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
						/>
					</svg>
                </a>
			</div>
		</div>
	{/if}
</div>

<style>
    @media print {
        .btn,
        .card {
            display: none !important;
        }

		.text-center {
			text-align: left !important;
        }
	}
</style>
