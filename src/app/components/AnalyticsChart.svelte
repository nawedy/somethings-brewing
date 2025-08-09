<!-- File: src/app/components/AnalyticsChart.svelte -->
<!-- Purpose: Dynamic chart component using Chart.js -->

<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	/** @type {import('chart.js').ChartType} */
	export let type = 'bar';
	/** @type {import('chart.js').ChartData} */
	export let data = { labels: [], datasets: [] };
	/** @type {import('chart.js').ChartOptions} */
	export let options = {};

	let chart;
	let canvas;

  let previousSerializedSignature = '';

		onMount(() => {
		if (canvas) {
				chart = new Chart(canvas, {
				type,
				data,
				options
			});
		}

		return () => {
			if (chart) chart.destroy();
		};
	});

	  $: {
    const currentSerializedSignature = JSON.stringify({ type, data, options });
    if (chart && currentSerializedSignature !== previousSerializedSignature) {
      chart.destroy();
				chart = new Chart(canvas, { type, data, options });
    }
    previousSerializedSignature = currentSerializedSignature;
  }
</script>

<canvas bind:this={canvas} class="h-64 w-full"></canvas>
