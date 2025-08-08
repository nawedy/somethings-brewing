<!-- File: src/components/Testimonials.svelte -->
<!-- Purpose: Customer testimonial cards with avatar, rating, and name/location -->

<script>
	let testimonials = [
		{
			name: 'Maria',
			city: 'Austin',
			state: 'TX',
			avatar: '/images/user1.jpg',
			quote: 'Absolutely love the coffee quality and customer service.'
		},
		{
			name: 'David',
			city: 'Portland',
			state: 'OR',
			avatar: '/images/user2.jpg',
			quote: 'Exceptional flavor, I look forward to every delivery!'
		},
		{
			name: 'Fatima',
			city: 'Chicago',
			state: 'IL',
			avatar: '/images/user3.jpg',
			quote: 'Delicious and fresh — just how coffee should be.'
		}
	];
</script>

<section class="bg-base-100 px-6 py-16">
	<h2 class="mb-12 text-center font-serif text-4xl">What Our Customers Say</h2>
	<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
		{#each testimonials as t, i}
			<div class="card bg-base-200 p-6 shadow-lg">
				<div class="flex items-center gap-4">
					<div class="avatar">
						<div class="w-16 rounded-full">
							<img src={t.avatar} alt={`Avatar of ${t.name}`} />
						</div>
					</div>
					<div>
						<h4 class="font-bold">{t.name}</h4>
						<p class="text-sm text-gray-500">{t.city}, {t.state}</p>
					</div>
				</div>
				<p class="mt-4 italic">“{t.quote}”</p>
				<div class="rating mt-2">
					{#each Array(5) as _, j}
						<input
							type="radio"
							name={`rating-${i}`}
							class="mask mask-star-2 bg-orange-400"
							checked
							readonly
						/>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>
