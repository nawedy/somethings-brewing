<!-- File: src/routes/checkout/+page.svelte -->
<!-- Complete checkout flow with Stripe Elements integration -->

<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { cart, cartTotal } from '$lib/stores/cart.js';
	import { auth } from '$lib/stores/auth.js';
	import { getStripe } from '$lib/stripe.js';

	// Form state
	let customerInfo = {
		email: '',
		fullName: '',
		phone: ''
	};

	let shippingAddress = {
		address: '',
		city: '',
		state: '',
		zipCode: '',
		country: 'US'
	};

	let billingAddress = {
		address: '',
		city: '',
		state: '',
		zipCode: '',
		country: 'US'
	};

	let useSameAddress = true;
	let isGift = false;
	let giftMessage = '';

	// Payment state
	let stripe = null;
	let elements = null;
	let cardElement = null;
	let processing = false;
	let errorMessage = '';
	let successMessage = '';

	// Validation state
	let formErrors = {};
	let touched = {};

	// Cart and auth state
	let cartItems = [];
	let total = 0;
	let user = null;
	let loading = true;

	// Subscribe to stores
	$: cartItems = $cart;
	$: total = $cartTotal;
	$: user = $auth.user;
	$: loading = $auth.loading;

	// Initialize on mount
	onMount(async () => {
		// Initialize auth and cart
		await auth.init();
		cart.init();

		// Redirect if cart is empty
		if (cartItems.length === 0) {
			goto('/cart');
			return;
		}

		// Pre-fill customer info if user is logged in
		if (user) {
			customerInfo.email = user.email || '';
			customerInfo.fullName = user.user_metadata?.full_name || '';
		}

		// Initialize Stripe
		await initializeStripe();
	});

	// Initialize Stripe Elements
	async function initializeStripe() {
		try {
			stripe = await getStripe();
			if (!stripe) {
				throw new Error('Stripe failed to load');
			}

			elements = stripe.elements({
				appearance: {
					theme: 'stripe',
					variables: {
						colorPrimary: '#0ea5e9'
					}
				}
			});

			cardElement = elements.create('card', {
				style: {
					base: {
						fontSize: '16px',
						color: '#424770',
						'::placeholder': {
							color: '#aab7c4'
						}
					}
				}
			});

			cardElement.mount('#card-element');

			// Handle card element changes
			cardElement.on('change', (event) => {
				if (event.error) {
					errorMessage = event.error.message;
				} else {
					errorMessage = '';
				}
			});
		} catch (error) {
			console.error('Error initializing Stripe:', error);
			errorMessage = 'Payment system failed to load. Please refresh the page.';
		}
	}

	// Form validation
	function validateForm() {
		const errors = {};

		// Customer info validation
		if (!customerInfo.email.trim()) {
			errors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
			errors.email = 'Please enter a valid email';
		}

		if (!customerInfo.fullName.trim()) {
			errors.fullName = 'Full name is required';
		}

		// Shipping address validation
		if (!shippingAddress.address.trim()) {
			errors.shippingAddress = 'Shipping address is required';
		}
		if (!shippingAddress.city.trim()) {
			errors.shippingCity = 'City is required';
		}
		if (!shippingAddress.state.trim()) {
			errors.shippingState = 'State is required';
		}
		if (!shippingAddress.zipCode.trim()) {
			errors.shippingZip = 'ZIP code is required';
		}

		// Billing address validation (if different)
		if (!useSameAddress) {
			if (!billingAddress.address.trim()) {
				errors.billingAddress = 'Billing address is required';
			}
			if (!billingAddress.city.trim()) {
				errors.billingCity = 'City is required';
			}
			if (!billingAddress.state.trim()) {
				errors.billingState = 'State is required';
			}
			if (!billingAddress.zipCode.trim()) {
				errors.billingZip = 'ZIP code is required';
			}
		}

		formErrors = errors;
		return Object.keys(errors).length === 0;
	}

	// Handle form submission
	async function handleSubmit() {
		if (processing) return;

		// Validate form
		if (!validateForm()) {
			errorMessage = 'Please correct the errors above';
			return;
		}

		// Check if user is authenticated
		if (!user) {
			errorMessage = 'Please log in to complete your order';
			return;
		}

		processing = true;
		errorMessage = '';

		try {
			// Step 1: Create order and get payment intent
			const orderData = {
				items: cartItems.map((item) => ({
					product_id: item.id,
					quantity: item.quantity
				})),
				customer_id: user.id,
				shipping_address: {
					...shippingAddress,
					recipient_name: customerInfo.fullName,
					recipient_email: customerInfo.email,
					recipient_phone: customerInfo.phone
				}
			};

			const orderResponse = await fetch('/api/orders/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(orderData)
			});

			const orderResult = await orderResponse.json();

			if (!orderResult.success) {
				throw new Error(orderResult.error || 'Failed to create order');
			}

			// Step 2: Confirm payment with Stripe
			const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
				orderResult.payment.client_secret,
				{
					payment_method: {
						card: cardElement,
						billing_details: {
							name: customerInfo.fullName,
							email: customerInfo.email,
							phone: customerInfo.phone,
							address: {
								line1: useSameAddress ? shippingAddress.address : billingAddress.address,
								city: useSameAddress ? shippingAddress.city : billingAddress.city,
								state: useSameAddress ? shippingAddress.state : billingAddress.state,
								postal_code: useSameAddress ? shippingAddress.zipCode : billingAddress.zipCode,
								country: useSameAddress ? shippingAddress.country : billingAddress.country
							}
						}
					}
				}
			);

			if (stripeError) {
				throw new Error(stripeError.message);
			}

			if (paymentIntent.status === 'succeeded') {
				// Clear cart and redirect to success page
				cart.clear();
				successMessage = 'Order placed successfully!';
				goto(`/confirmation?order_id=${orderResult.order.id}&payment_intent=${paymentIntent.id}`);
			} else {
				throw new Error('Payment was not completed successfully');
			}
		} catch (error) {
			console.error('Checkout error:', error);
			errorMessage = error.message || 'An error occurred during checkout. Please try again.';
		} finally {
			processing = false;
		}
	}

	// Handle field touch for validation display
	function handleBlur(fieldName) {
		touched[fieldName] = true;
		touched = { ...touched };
	}

	// Copy shipping to billing address
	function copyShippingToBilling() {
		if (useSameAddress) {
			billingAddress = { ...shippingAddress };
		}
	}

	$: if (useSameAddress) {
		copyShippingToBilling();
	}
</script>

<svelte:head>
	<title>Checkout - Something's Brewing</title>
	<meta name="description" content="Complete your coffee order securely" />
</svelte:head>

<div class="mx-auto max-w-6xl p-6">
	{#if loading}
		<div class="flex min-h-96 items-center justify-center">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if cartItems.length === 0}
		<div class="py-12 text-center">
			<h1 class="mb-4 text-2xl font-bold">Your cart is empty</h1>
			<p class="mb-6">Add some items to your cart before checking out.</p>
			<a href="/products" class="btn btn-primary">Shop Now</a>
		</div>
	{:else}
		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Order Summary -->
			<div class="order-2 lg:order-1 lg:col-span-1">
				<div class="card bg-base-200 p-6">
					<h2 class="mb-4 text-xl font-bold">Order Summary</h2>

					<div class="mb-6 space-y-4">
						{#each cartItems as item}
							<div class="flex items-center gap-4">
								<img src={item.image_url} alt={item.name} class="h-16 w-16 rounded object-cover" />
								<div class="flex-1">
									<h3 class="font-medium">{item.name}</h3>
									<p class="text-sm opacity-70">Qty: {item.quantity}</p>
								</div>
								<div class="text-right">
									<p class="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
								</div>
							</div>
						{/each}
					</div>

					<div class="border-t pt-4">
						<div class="flex items-center justify-between text-lg font-bold">
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>
					</div>

					{#if isGift}
						<div class="mt-4">
							<label class="label">
								<span class="label-text">Gift Message (Optional)</span>
							</label>
							<textarea
								class="textarea textarea-bordered w-full"
								placeholder="Enter your gift message..."
								bind:value={giftMessage}
								rows="3"
							></textarea>
						</div>
					{/if}
				</div>
			</div>

			<!-- Checkout Form -->
			<div class="order-1 lg:order-2 lg:col-span-2">
				<form on:submit|preventDefault={handleSubmit} class="space-y-8">
					<h1 class="text-3xl font-bold">Checkout</h1>

					{#if errorMessage}
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
							<span>{errorMessage}</span>
						</div>
					{/if}

					{#if successMessage}
						<div class="alert alert-success">
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
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{successMessage}</span>
						</div>
					{/if}

					<!-- Customer Information -->
					<div class="card bg-base-100 p-6">
						<h2 class="mb-4 text-xl font-bold">Customer Information</h2>
						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label class="label" for="email">
									<span class="label-text">Email Address *</span>
								</label>
								<input
									id="email"
									type="email"
									class="input input-bordered w-full {formErrors.email && touched.email
										? 'input-error'
										: ''}"
									placeholder="your@email.com"
									bind:value={customerInfo.email}
									on:blur={() => handleBlur('email')}
									required
								/>
								{#if formErrors.email && touched.email}
									<div class="label">
										<span class="label-text-alt text-error">{formErrors.email}</span>
									</div>
								{/if}
							</div>
							<div>
								<label class="label" for="fullName">
									<span class="label-text">Full Name *</span>
								</label>
								<input
									id="fullName"
									type="text"
									class="input input-bordered w-full {formErrors.fullName && touched.fullName
										? 'input-error'
										: ''}"
									placeholder="John Doe"
									bind:value={customerInfo.fullName}
									on:blur={() => handleBlur('fullName')}
									required
								/>
								{#if formErrors.fullName && touched.fullName}
									<div class="label">
										<span class="label-text-alt text-error">{formErrors.fullName}</span>
									</div>
								{/if}
							</div>
							<div class="md:col-span-2">
								<label class="label" for="phone">
									<span class="label-text">Phone Number (Optional)</span>
								</label>
								<input
									id="phone"
									type="tel"
									class="input input-bordered w-full"
									placeholder="+1 (555) 123-4567"
									bind:value={customerInfo.phone}
								/>
							</div>
						</div>
					</div>

					<!-- Shipping Address -->
					<div class="card bg-base-100 p-6">
						<h2 class="mb-4 text-xl font-bold">Shipping Address</h2>
						<div class="grid gap-4">
							<div>
								<label class="label" for="shippingAddress">
									<span class="label-text">Street Address *</span>
								</label>
								<input
									id="shippingAddress"
									type="text"
									class="input input-bordered w-full {formErrors.shippingAddress &&
									touched.shippingAddress
										? 'input-error'
										: ''}"
									placeholder="123 Main Street"
									bind:value={shippingAddress.address}
									on:blur={() => handleBlur('shippingAddress')}
									required
								/>
								{#if formErrors.shippingAddress && touched.shippingAddress}
									<div class="label">
										<span class="label-text-alt text-error">{formErrors.shippingAddress}</span>
									</div>
								{/if}
							</div>
							<div class="grid gap-4 md:grid-cols-3">
								<div>
									<label class="label" for="shippingCity">
										<span class="label-text">City *</span>
									</label>
									<input
										id="shippingCity"
										type="text"
										class="input input-bordered w-full {formErrors.shippingCity &&
										touched.shippingCity
											? 'input-error'
											: ''}"
										placeholder="New York"
										bind:value={shippingAddress.city}
										on:blur={() => handleBlur('shippingCity')}
										required
									/>
									{#if formErrors.shippingCity && touched.shippingCity}
										<div class="label">
											<span class="label-text-alt text-error">{formErrors.shippingCity}</span>
										</div>
									{/if}
								</div>
								<div>
									<label class="label" for="shippingState">
										<span class="label-text">State *</span>
									</label>
									<input
										id="shippingState"
										type="text"
										class="input input-bordered w-full {formErrors.shippingState &&
										touched.shippingState
											? 'input-error'
											: ''}"
										placeholder="NY"
										bind:value={shippingAddress.state}
										on:blur={() => handleBlur('shippingState')}
										required
									/>
									{#if formErrors.shippingState && touched.shippingState}
										<div class="label">
											<span class="label-text-alt text-error">{formErrors.shippingState}</span>
										</div>
									{/if}
								</div>
								<div>
									<label class="label" for="shippingZip">
										<span class="label-text">ZIP Code *</span>
									</label>
									<input
										id="shippingZip"
										type="text"
										class="input input-bordered w-full {formErrors.shippingZip &&
										touched.shippingZip
											? 'input-error'
											: ''}"
										placeholder="10001"
										bind:value={shippingAddress.zipCode}
										on:blur={() => handleBlur('shippingZip')}
										required
									/>
									{#if formErrors.shippingZip && touched.shippingZip}
										<div class="label">
											<span class="label-text-alt text-error">{formErrors.shippingZip}</span>
										</div>
									{/if}
								</div>
							</div>
						</div>

						<div class="mt-4 space-y-2">
							<label class="flex cursor-pointer items-center gap-2">
								<input type="checkbox" class="checkbox" bind:checked={useSameAddress} />
								<span>Billing address same as shipping</span>
							</label>
							<label class="flex cursor-pointer items-center gap-2">
								<input type="checkbox" class="checkbox" bind:checked={isGift} />
								<span>This is a gift</span>
							</label>
						</div>
					</div>

					<!-- Billing Address (if different) -->
					{#if !useSameAddress}
						<div class="card bg-base-100 p-6">
							<h2 class="mb-4 text-xl font-bold">Billing Address</h2>
							<div class="grid gap-4">
								<div>
									<label class="label" for="billingAddress">
										<span class="label-text">Street Address *</span>
									</label>
									<input
										id="billingAddress"
										type="text"
										class="input input-bordered w-full {formErrors.billingAddress &&
										touched.billingAddress
											? 'input-error'
											: ''}"
										placeholder="123 Main Street"
										bind:value={billingAddress.address}
										on:blur={() => handleBlur('billingAddress')}
										required
									/>
									{#if formErrors.billingAddress && touched.billingAddress}
										<div class="label">
											<span class="label-text-alt text-error">{formErrors.billingAddress}</span>
										</div>
									{/if}
								</div>
								<div class="grid gap-4 md:grid-cols-3">
									<div>
										<label class="label" for="billingCity">
											<span class="label-text">City *</span>
										</label>
										<input
											id="billingCity"
											type="text"
											class="input input-bordered w-full {formErrors.billingCity &&
											touched.billingCity
												? 'input-error'
												: ''}"
											placeholder="New York"
											bind:value={billingAddress.city}
											on:blur={() => handleBlur('billingCity')}
											required
										/>
										{#if formErrors.billingCity && touched.billingCity}
											<div class="label">
												<span class="label-text-alt text-error">{formErrors.billingCity}</span>
											</div>
										{/if}
									</div>
									<div>
										<label class="label" for="billingState">
											<span class="label-text">State *</span>
										</label>
										<input
											id="billingState"
											type="text"
											class="input input-bordered w-full {formErrors.billingState &&
											touched.billingState
												? 'input-error'
												: ''}"
											placeholder="NY"
											bind:value={billingAddress.state}
											on:blur={() => handleBlur('billingState')}
											required
										/>
										{#if formErrors.billingState && touched.billingState}
											<div class="label">
												<span class="label-text-alt text-error">{formErrors.billingState}</span>
											</div>
										{/if}
									</div>
									<div>
										<label class="label" for="billingZip">
											<span class="label-text">ZIP Code *</span>
										</label>
										<input
											id="billingZip"
											type="text"
											class="input input-bordered w-full {formErrors.billingZip &&
											touched.billingZip
												? 'input-error'
												: ''}"
											placeholder="10001"
											bind:value={billingAddress.zipCode}
											on:blur={() => handleBlur('billingZip')}
											required
										/>
										{#if formErrors.billingZip && touched.billingZip}
											<div class="label">
												<span class="label-text-alt text-error">{formErrors.billingZip}</span>
											</div>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Payment Information -->
					<div class="card bg-base-100 p-6">
						<h2 class="mb-4 text-xl font-bold">Payment Information</h2>
						<div>
							<label class="label">
								<span class="label-text">Card Details *</span>
							</label>
							<div id="card-element" class="border-base-300 bg-base-50 rounded-lg border p-3"></div>
							{#if errorMessage}
								<div class="label">
									<span class="label-text-alt text-error">{errorMessage}</span>
								</div>
							{/if}
						</div>

						<div class="mt-4 text-sm opacity-70">
							<p>🔒 Your payment information is secure and encrypted.</p>
							<p>We accept all major credit cards.</p>
						</div>
					</div>

					<!-- Submit Button -->
					<div class="text-center">
						<button
							type="submit"
							class="btn btn-primary btn-lg w-full max-w-md"
							disabled={processing || !user}
						>
							{#if processing}
								<span class="loading loading-spinner"></span>
								Processing...
							{:else}
								Complete Order - ${total.toFixed(2)}
							{/if}
						</button>

						{#if !user}
							<p class="mt-4 text-sm">
								Please <a href="/login" class="link">log in</a> to complete your order.
							</p>
						{/if}
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Custom styles for Stripe Elements */
	#card-element {
		min-height: 40px;
		display: flex;
		align-items: center;
	}

	/* Focus styles */
	#card-element.StripeElement--focus {
		border-color: #0ea5e9;
		box-shadow: 0 0 0 1px #0ea5e9;
	}
</style>
