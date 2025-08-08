<script>
	let payments = [
		{ id: 'pay_001', date: '2024-05-01', amount: 38.5, status: 'Success' },
		{ id: 'pay_002', date: '2024-05-02', amount: 27.0, status: 'Failed' }
	];
</script>

<section class="space-y-6 p-8">
	<h1 class="text-2xl font-bold">Payment History</h1>

	<table class="table w-full">
		<thead>
			<tr>
				<th>ID</th>
				<th>Date</th>
				<th>Amount</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each payments as p}
				<tr>
					<td>{p.id}</td>
					<td>{p.date}</td>
					<td>${p.amount.toFixed(2)}</td>
					<td>
						<span class="badge {p.status === 'Success' ? 'badge-success' : 'badge-error'}"
							>{p.status}</span
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
