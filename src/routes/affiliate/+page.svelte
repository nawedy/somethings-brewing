<script>
	import DashboardCard from '$components/DashboardCard.svelte';
	import ReferralTable from '$components/ReferralTable.svelte';

	let stats = {
		totalClicks: 342,
		totalConversions: 58,
		totalEarnings: 492.0
	};

	let referrals = [
		{ code: 'BREW10', clicks: 180, conversions: 24, earnings: 210.5 },
		{ code: 'COFFEE20', clicks: 162, conversions: 34, earnings: 281.5 }
	];
</script>

<section class="space-y-8 p-8">
	<h1 class="text-3xl font-bold">Affiliate Overview</h1>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<DashboardCard label="Clicks" value={stats.totalClicks} />
		<DashboardCard label="Conversions" value={stats.totalConversions} />
		<DashboardCard label="Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} />
	</div>

	<div class="mt-6">
		<h2 class="mb-2 text-xl font-semibold">Your Referral Codes</h2>
		<ReferralTable {referrals} />
	</div>
</section>
