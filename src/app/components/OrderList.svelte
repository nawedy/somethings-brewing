<!-- File: src/components/OrderList.svelte -->
<!-- Purpose: Reusable admin/customer order table -->

<script>
	export let orders = [];
</script>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th>Order ID</th>
				<th>Date</th>
				<th>Status</th>
				<th>Total</th>
			</tr>
		</thead>
		<tbody>
			{#each orders as order}
				<tr>
					<td>{order.id}</td>
					<td>{new Date(order.created_at).toLocaleDateString()}</td>
					<td>{order.status}</td>
					<td>${order.total.toFixed(2)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
