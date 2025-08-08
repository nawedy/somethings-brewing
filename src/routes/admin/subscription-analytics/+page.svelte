<!-- File: src/routes/admin/subscription-analytics/+page.svelte -->
<!-- Purpose: Subscription analytics dashboard with visualized metrics -->

<!-- Purpose: Subscription analytics dashboard using Chart.js and Supabase -->

<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import Chart from '$lib/Chart.svelte';
	import 'chart.js/auto';

	let frequencyMap = {};
	let statusCounts = { active: 0, paused: 0 };
	let total = 0;

	onMount(async () => {
		const { data, error } = await supabase
			.from('product_subscriptions')
			.select('frequency, subscription_active');

		if (error) {
			console.error('Error loading subscription data', error);
			return;
		}

		frequencyMap = {};
		statusCounts = { active: 0, paused: 0 };

		for (const sub of data) {
			const freq = sub.frequency || 'Unspecified';
			frequencyMap[freq] = (frequencyMap[freq] || 0) + 1;
			sub.subscription_active ? statusCounts.active++ : statusCounts.paused++;
		}

		total = data.length;
	});

	$: frequencyChart = {
		labels: Object.keys(frequencyMap),
		datasets: [
			{
				label: 'Subscriptions by Frequency',
				data: Object.values(frequencyMap),
				backgroundColor: [
					'rgba(96, 165, 250, 0.7)', // Blue
					'rgba(251, 191, 36, 0.7)', // Yellow
					'rgba(74, 222, 128, 0.7)' // Green
				]
			}
		]
	};

	$: statusChart = {
		labels: ['Active', 'Paused'],
		datasets: [
			{
				label: 'Subscription Status',
				data: [statusCounts.active, statusCounts.paused],
				backgroundColor: ['rgba(34,197,94,0.7)', 'rgba(251,191,36,0.7)']
			}
		]
	};
</script>

<section class="mx-auto max-w-6xl space-y-8 p-10">
	<h1 class="text-3xl font-bold">Subscription Analytics</h1>

	<!-- Summary Cards -->
	<div class="stats mb-6 grid grid-cols-1 shadow sm:grid-cols-3">
		<div class="stat">
			<div class="stat-title">Total Subscriptions</div>
			<div class="stat-value">{total}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Active</div>
			<div class="stat-value text-success">{statusCounts.active}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Paused</div>
			<div class="stat-value text-warning">{statusCounts.paused}</div>
		</div>
	</div>

	<!-- Charts -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="bg-base-100 rounded p-6 shadow">
			<h2 class="mb-2 text-lg font-semibold">Delivery Frequency Breakdown</h2>
			{#if Object.keys(frequencyMap).length > 0}
				<ChartJS type="pie" data={frequencyChart} />
			{:else}
				<p class="text-sm text-gray-500">No frequency data available.</p>
			{/if}
		</div>

		<div class="bg-base-100 rounded p-6 shadow">
			<h2 class="mb-2 text-lg font-semibold">Status Distribution</h2>
			<ChartJS type="doughnut" data={statusChart} />
		</div>
	</div>
</section>
