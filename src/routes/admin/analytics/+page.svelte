<script>
	import AnalyticsChart from '$components/AnalyticsChart.svelte';

	let data = {
		labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
		datasets: [
			{
				label: 'Subscription Signups',
				data: [10, 25, 18, 34],
				backgroundColor: 'rgba(34,197,94,0.6)'
			}
		]
	};
</script>

<section class="p-8">
	<h1 class="mb-4 text-xl font-bold">Analytics</h1>
	<AnalyticsChart type="bar" {data} />
</section>
