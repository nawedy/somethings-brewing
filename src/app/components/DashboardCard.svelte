<!-- File: src/components/DashboardCard.svelte -->
<!-- Purpose: Reusable dashboard stat card -->

<script>
	export let label = '';
	/** @type {string | number} */
	export let value = '';
	export let icon = null;
</script>

<div class="card bg-base-100 flex items-center gap-4 p-4 shadow-md">
	{#if icon}
		<div class="text-primary text-3xl">{@html icon}</div>
	{/if}
	<div>
		<h3 class="text-sm text-gray-500">{label}</h3>
		<p class="text-2xl font-bold">{value}</p>
	</div>
</div>
