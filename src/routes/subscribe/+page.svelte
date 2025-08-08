<!-- Purpose: Let customers pick a coffee subscription plan -->

<script>
	let plans = [
		{
			id: 'sub_monthly',
			name: 'Monthly Plan',
			price: 14.99,
			desc: '1 bag of fresh coffee delivered monthly.'
		},
		{ id: 'sub_biweekly', name: 'Biweekly Plan', price: 27.99, desc: '2 bags every two weeks.' },
		{ id: 'sub_weekly', name: 'Weekly Plan', price: 49.99, desc: '4 bags every week.' }
	];
</script>

<section class="mx-auto max-w-3xl space-y-6 p-8">
	<h1 class="text-center text-2xl font-bold">Choose Your Subscription</h1>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		{#each plans as plan}
			<div class="card bg-base-100 space-y-2 p-4 text-center shadow">
				<h2 class="text-lg font-semibold">{plan.name}</h2>
				<p class="text-2xl font-bold">${plan.price.toFixed(2)}</p>
				<p class="text-sm text-gray-600">{plan.desc}</p>
				<button class="btn btn-primary btn-sm mt-2">Subscribe</button>
			</div>
		{/each}
	</div>
</section>
