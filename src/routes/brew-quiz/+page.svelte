<!-- File: src/routes/brew-quiz/+page.svelte -->
<!-- Purpose: Interactive brew guide quiz page -->

<script>
	let step = 0;
	let answers = { roast: '', flavor: '', method: '', caffeine: '' };

	const next = () => step++;
	const submit = () => console.log('Quiz results:', answers);
</script>

<section class="mx-auto max-w-2xl p-10">
	<h1 class="mb-6 text-center font-serif text-4xl">Brew Guide Quiz</h1>

	{#if step === 0}
		<div>
			<p class="mb-4">What roast level do you prefer?</p>
			<div class="flex gap-2">
				<button
					class="btn"
					on:click={() => {
						answers.roast = 'Light';
						next();
					}}>Light</button
				>
				<button
					class="btn"
					on:click={() => {
						answers.roast = 'Medium';
						next();
					}}>Medium</button
				>
				<button
					class="btn"
					on:click={() => {
						answers.roast = 'Dark';
						next();
					}}>Dark</button
				>
			</div>
		</div>
	{:else if step === 1}
		<div>
			<p class="mb-4">Pick a flavor profile:</p>
			<div class="flex gap-2">
				<button
					class="btn"
					on:click={() => {
						answers.flavor = 'Nutty';
						next();
					}}>Nutty</button
				>
				<button
					class="btn"
					on:click={() => {
						answers.flavor = 'Fruity';
						next();
					}}>Fruity</button
				>
				<button
					class="btn"
					on:click={() => {
						answers.flavor = 'Spicy';
						next();
					}}>Spicy</button
				>
			</div>
		</div>
	{:else if step === 2}
		<div>
			<p class="mb-4">Preferred brewing method:</p>
			<div class="flex gap-2">
				<button
					class="btn"
					on:click={() => {
						answers.method = 'Pour Over';
						next();
					}}>Pour Over</button
				>
				<button
					class="btn"
					on:click={() => {
						answers.method = 'French Press';
						next();
					}}>French Press</button
				>
				<button
					class="btn"
					on:click={() => {
						answers.method = 'Espresso';
						next();
					}}>Espresso</button
				>
			</div>
		</div>
	{:else if step === 3}
		<div>
			<p class="mb-4">Caffeine preference:</p>
			<div class="flex gap-2">
				<button
					class="btn"
					on:click={() => {
						answers.caffeine = 'High';
						next();
					}}>High</button
				>
				<button
					class="btn"
					on:click={() => {
						answers.caffeine = 'Medium';
						next();
					}}>Medium</button
				>
				<button
					class="btn"
					on:click={() => {
						answers.caffeine = 'Decaf';
						next();
					}}>Decaf</button
				>
			</div>
		</div>
	{:else}
		<div class="text-center">
			<p class="mb-6">You're matched with a curated roast based on your taste!</p>
			<pre class="bg-base-200 rounded p-4 text-left">{JSON.stringify(answers, null, 2)}</pre>
			<a href="/products" class="btn btn-primary mt-6">View Recommended Beans</a>
		</div>
	{/if}
</section>
