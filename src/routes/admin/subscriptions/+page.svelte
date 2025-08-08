<script>
	import SubscriptionList from '$components/SubscriptionList.svelte';

	let subscriptions = [
		{
			id: 'sub_001',
			product_name: 'Yemeni Mocha',
			quantity: 1,
			frequency: 'Monthly',
			next_delivery_date: '2024-06-01',
			subscription_active: true
		},
		{
			id: 'sub_002',
			product_name: 'Ethiopian Yirgacheffe',
			quantity: 2,
			frequency: 'Biweekly',
			next_delivery_date: '2024-05-15',
			subscription_active: false
		}
	];
</script>

<section class="space-y-6 p-8">
	<h1 class="text-2xl font-bold">Manage Subscriptions</h1>

	<SubscriptionList {subscriptions} />
</section>
