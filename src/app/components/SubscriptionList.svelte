<!-- File: src/components/SubscriptionList.svelte -->
<!-- Purpose: Display a list of customer subscriptions -->

<script>
	export let subscriptions = [];
</script>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th>Product</th>
				<th>Quantity</th>
				<th>Frequency</th>
				<th>Next Delivery</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each subscriptions as sub}
				<tr>
					<td>{sub.product_name}</td>
					<td>{sub.quantity}</td>
					<td>{sub.frequency}</td>
					<td>{sub.next_delivery_date}</td>
					<td>
						<span class="badge {sub.subscription_active ? 'badge-success' : 'badge-error'}">
							{sub.subscription_active ? 'Active' : 'Paused'}
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
