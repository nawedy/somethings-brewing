<script>
	import DashboardCard from '$components/DashboardCard.svelte';
	import AnalyticsChart from '$components/AnalyticsChart.svelte';

	let metrics = {
		revenue: '$10,200',
		orders: 142,
		signups: 24,
		quizCompletions: 12
	};

	let chartData = {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'Daily Orders',
				data: [12, 18, 22, 19, 14, 10, 17],
				backgroundColor: 'rgba(34,197,94,0.6)'
			}
		]
	};
</script>

<section class="space-y-6 p-8">
	<h1 class="text-3xl font-bold">Admin Overview</h1>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<DashboardCard label="Revenue" value={metrics.revenue} />
		<DashboardCard label="Orders" value={metrics.orders} />
		<DashboardCard label="Signups" value={metrics.signups} />
		<DashboardCard label="Quiz Completions" value={metrics.quizCompletions} />
	</div>

	<div class="mt-8">
		<AnalyticsChart type="bar" data={chartData} />
	</div>
</section>
