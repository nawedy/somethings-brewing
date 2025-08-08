<!-- File: src/components/ImageWithTextLeft.svelte -->
<script>
	export let title = 'Your Title';
	export let subtitle = 'Optional Subtitle';
	export let body = 'Some detailed body text about this section.';
	export let image = '/images/sample-left.jpg';
	export let ctaText = 'Learn More';
	export let ctaLink = '/learn-more';
</script>

<section class="bg-[#342721] px-6 py-16 text-[#f5e9dd]">
	<div class="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
		<img src={image} alt={title} class="h-auto w-full rounded shadow-lg" />
		<div>
			<h2 class="mb-4 font-serif text-3xl font-bold">{title}</h2>
			{#if subtitle}
				<h3 class="mb-2 text-xl font-medium">{subtitle}</h3>
			{/if}
			<p class="mb-6">{body}</p>
			<a href={ctaLink} class="btn btn-accent font-semibold text-[#342721]">{ctaText}</a>
		</div>
	</div>
</section>
