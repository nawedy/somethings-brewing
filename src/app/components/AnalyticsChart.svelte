<!-- File: src/app/components/AnalyticsChart.svelte -->
<!-- Purpose: Dynamic chart component using Chart.js -->

<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let type = 'bar';
	export let data = {};
	export let options = {};

	let chart;
	let canvas;

  let last = '';
  $: serialized = JSON.stringify({ type, data, options });
  $: shouldRebuild = serialized !== last;

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

  $: if (chart && shouldRebuild) {
    last = serialized;
    chart.destroy();
    chart = new Chart(canvas, { type, data, options });
  }
</script>

<canvas bind:this={canvas} class="h-64 w-full"></canvas>
