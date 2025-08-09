<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	/** @type {import('chart.js').ChartType} */
	export let type = 'bar';
	/** @type {import('chart.js').ChartData} */
	export let data = { labels: [], datasets: [] };
	/** @type {import('chart.js').ChartOptions} */
	export let options = {};

	let canvas;

	onMount(() => {
		const chart = new Chart(canvas, {
			type,
			data,
			options
		});

		return () => chart.destroy();
	});
</script>

<canvas bind:this={canvas}></canvas>
