<script>
	let subscriptions = [
		{
			id: 'sub_101',
			product_name: 'Ethiopian Light Roast',
			quantity: 2,
			frequency: 'Monthly',
			next_delivery_date: '2024-06-15',
			last_delivery_date: '2024-05-15',
			subscription_active: true
		},
		{
			id: 'sub_102',
			product_name: 'Yemeni Dark Roast',
			quantity: 1,
			frequency: 'Weekly',
			next_delivery_date: '2024-05-10',
			last_delivery_date: '2024-05-03',
			subscription_active: false
		}
	];

	function cancelSubscription(id) {
		subscriptions = subscriptions.map((s) =>
			s.id === id ? { ...s, subscription_active: false } : s
		);
	}

	function pauseSubscription(id) {
		subscriptions = subscriptions.map((s) =>
			s.id === id ? { ...s, subscription_active: false } : s
		);
	}

	function resumeSubscription(id) {
		subscriptions = subscriptions.map((s) =>
			s.id === id ? { ...s, subscription_active: true } : s
		);
	}
</script>

<section class="space-y-6 p-8">
	<h1 class="text-2xl font-bold">My Subscriptions</h1>

	{#if subscriptions.length === 0}
		<p class="text-gray-500">You have no active subscriptions.</p>
	{:else}
		<div class="space-y-4">
			{#each subscriptions as sub}
				<div class="card bg-base-100 p-6 shadow-md">
					<h2 class="text-lg font-semibold">{sub.product_name}</h2>
					<p class="text-sm text-gray-600">
						Frequency: {sub.frequency} • Quantity: {sub.quantity}
					</p>
					<p class="text-sm">Next Delivery: {sub.next_delivery_date}</p>
					<p class="mb-2 text-sm">Last Delivery: {sub.last_delivery_date}</p>

					<div class="mt-4 flex flex-wrap gap-2">
						{#if sub.subscription_active}
							<button class="btn btn-sm btn-outline" on:click={() => pauseSubscription(sub.id)}
								>Pause</button
							>
							<button class="btn btn-sm btn-error" on:click={() => cancelSubscription(sub.id)}
								>Cancel</button
							>
						{:else}
							<button class="btn btn-sm btn-success" on:click={() => resumeSubscription(sub.id)}
								>Resume</button
							>
						{/if}
						<button class="btn btn-sm">Change Quantity</button>
						<button class="btn btn-sm">Change Frequency</button>
						<button class="btn btn-sm">Skip Next Delivery</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
