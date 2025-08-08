<!-- File: src/routes/affiliate/withdrawals/+page.svelte -->
<!-- Purpose: Affiliate payout history dashboard -->

<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	let withdrawals = [];
	let loading = true;
	let error = null;

	onMount(async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			error = 'Not logged in.';
			loading = false;
			return;
		}

		const { data, error: fetchError } = await supabase
			.from('affiliate_payouts')
			.select('*')
			.eq('affiliate_id', user.id)
			.order('requested_at', { ascending: false });

		if (fetchError) {
			error = fetchError.message;
		} else {
			withdrawals = data;
		}

		loading = false;
	});
</script>

<section class="mx-auto max-w-3xl space-y-6 p-8">
	<h1 class="text-2xl font-bold">Payout History</h1>

	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="text-red-600">{error}</p>
	{:else if withdrawals.length === 0}
		<p>No payouts yet.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th>Amount</th>
						<th>Status</th>
						<th>Method</th>
						<th>Requested</th>
						<th>Paid</th>
					</tr>
				</thead>
				<tbody>
					{#each withdrawals as payout}
						<tr>
							<td>${payout.amount.toFixed(2)}</td>
							<td>
								<span class="badge {payout.status === 'paid' ? 'badge-success' : 'badge-warning'}">
									{payout.status}
								</span>
							</td>
							<td>{payout.method}</td>
							<td>{new Date(payout.requested_at).toLocaleDateString()}</td>
							<td>
								{payout.paid_at ? new Date(payout.paid_at).toLocaleDateString() : '—'}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
