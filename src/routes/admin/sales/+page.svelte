<script>
	import DashboardCard from '$components/DashboardCard.svelte';
	import AnalyticsChart from '$components/AnalyticsChart.svelte';

	let stats = {
		totalSales: 328,
		totalRevenue: 8420.75,
		avgOrder: 25.67
	};

	let data = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr'],
		datasets: [
			{
				label: 'Monthly Sales',
				data: [70, 88, 95, 75],
				backgroundColor: 'rgba(234, 179, 8, 0.6)'
			}
		]
	};
</script>

<section class="space-y-6 p-8">
	<h1 class="text-2xl font-bold">Sales Dashboard</h1>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<DashboardCard label="Orders" value={stats.totalSales} />
		<DashboardCard label="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
		<DashboardCard label="Avg Order" value={`$${stats.avgOrder.toFixed(2)}`} />
	</div>

	<AnalyticsChart type="bar" {data} />
</section>
