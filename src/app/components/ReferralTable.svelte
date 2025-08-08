<!-- File: src/components/ReferralTable.svelte -->
<!-- Purpose: Affiliate referral performance table -->

<script>
	export let referrals = [];
</script>

<table class="table w-full">
	<thead>
		<tr>
			<th>Referral Code</th>
			<th>Clicks</th>
			<th>Conversions</th>
			<th>Conversion Rate</th>
			<th>Earnings</th>
		</tr>
	</thead>
	<tbody>
		{#each referrals as r}
			<tr>
				<td>{r.code}</td>
				<td>{r.clicks}</td>
				<td>{r.conversions}</td>
				<td>{((r.conversions / r.clicks) * 100).toFixed(2)}%</td>
				<td>${r.earnings.toFixed(2)}</td>
			</tr>
		{/each}
	</tbody>
</table>
