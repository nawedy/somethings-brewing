<!-- File: src/components/PayoutHistory.svelte -->
<!-- Purpose: Affiliate payout records -->

<script>
	export let payouts = [];
</script>

<table class="table w-full">
	<thead>
		<tr>
			<th>Amount</th>
			<th>Status</th>
			<th>Method</th>
			<th>Date</th>
		</tr>
	</thead>
	<tbody>
		{#each payouts as payout}
			<tr>
				<td>${payout.amount.toFixed(2)}</td>
				<td>{payout.status}</td>
				<td>{payout.method}</td>
				<td>{new Date(payout.created_at).toLocaleDateString()}</td>
			</tr>
		{/each}
	</tbody>
</table>
