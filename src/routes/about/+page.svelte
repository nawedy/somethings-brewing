<!-- File: src/routes/about/+page.svelte -->
<!-- Purpose: About page with company story, mission, and team -->

<script>
	const mission =
		'To bring the world closer through coffee—ethically sourced, freshly roasted, and delivered with care.';
	const values = ['Sustainability', 'Community', 'Transparency', 'Craftsmanship'];

	const team = [
		{ name: 'Amina Yusuf', role: 'Founder & Roaster', image: '/images/team/amina.jpg' },
		{ name: 'Jonas Mekonnen', role: 'Creative Director', image: '/images/team/jonas.jpg' },
		{ name: 'Sarah Kim', role: 'Customer Experience', image: '/images/team/sarah.jpg' }
	];
</script>

<section class="mx-auto max-w-5xl p-10">
	<h1 class="mb-6 text-4xl font-bold">About Us</h1>

	<p class="mb-6 text-lg">
		Something's Brewing was born from a passion for authentic coffee experiences. Our journey began
		in a small home kitchen with beans from Ethiopia and Yemen, hand-roasted and shared with
		friends. Today, we ship globally, but our roots and values remain the same.
	</p>

	<div class="bg-base-200 mb-10 rounded-lg p-6">
		<h2 class="mb-3 text-2xl font-semibold">Our Mission</h2>
		<p>{mission}</p>
	</div>

	<div class="mb-10">
		<h2 class="mb-3 text-2xl font-semibold">Our Values</h2>
		<ul class="list-inside list-disc">
			{#each values as value}
				<li class="text-neutral-content text-base">{value}</li>
			{/each}
		</ul>
	</div>

	<div>
		<h2 class="mb-6 text-2xl font-semibold">Meet the Team</h2>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
			{#each team as member}
				<div class="card bg-base-100 shadow-md">
					<figure>
						<img
							src={member.image}
							alt={member.name}
							class="h-48 w-full rounded-t-lg object-cover"
						/>
					</figure>
					<div class="card-body text-center">
						<h3 class="card-title text-lg">{member.name}</h3>
						<p class="text-sm text-gray-500">{member.role}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
