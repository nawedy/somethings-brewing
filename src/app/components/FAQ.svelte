<!-- File: src/app/components/FAQ.svelte -->
<!-- Purpose: Collapsible FAQ accordion section with 5 questions -->

<script>
	let faqs = [
		{
			q: 'Where do you source your beans?',
			a: 'We source from ethically-run farms around the world.'
		},
		{ q: 'How fresh is the coffee?', a: 'We roast weekly and ship within 24 hours.' },
		{ q: 'Do you offer subscriptions?', a: 'Yes, customizable plans are available.' },
		{ q: 'Can I return a product?', a: 'Yes, within 30 days if unopened.' },
		{ q: 'Do you ship internationally?', a: 'Yes, to most countries with tracking.' }
	];
</script>

<section class="bg-base-200 px-6 py-12">
	<h2 class="mb-8 text-center font-serif text-4xl">Frequently Asked Questions</h2>
	<div class="join join-vertical mx-auto w-full max-w-3xl">
		{#each faqs as faq, idx}
			<div class="collapse-arrow bg-base-100 join-item collapse">
				<input type="checkbox" id={`faq-${idx}`} />
				<div class="collapse-title text-lg font-medium">{faq.q}</div>
				<div class="collapse-content">
					<p>{faq.a}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
