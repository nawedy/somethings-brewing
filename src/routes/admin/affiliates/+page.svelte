<script>
	import ReferralTable from '$components/ReferralTable.svelte';

	let referrals = [
		{
			code: 'COFFEE20',
			clicks: 120,
			conversions: 25,
			earnings: 210.5
		}
	];
</script>

<section class="p-8">
	<h1 class="mb-4 text-2xl font-bold">Affiliate Performance</h1>
	<ReferralTable {referrals} />
</section>
