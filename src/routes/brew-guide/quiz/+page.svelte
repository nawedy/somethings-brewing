<script>
	let step = 0;
	let result = null;
	let answers = [];

	let questions = [
		{
			q: 'How strong do you like your coffee?',
			options: ['Light', 'Balanced', 'Strong']
		},
		{
			q: 'Do you prefer quick or slow brew methods?',
			options: ['Quick', 'Slow']
		},
		{
			q: 'How do you brew your coffee?',
			options: ['French Press', 'Keurig', 'Drip', 'Pour Over', 'Espresso']
		},
		{
			q: 'Do you prefer a single origin or a blend?',
			options: ['Single Origin', 'Blend']
		},
		{
			q: 'Do you mind using special equipment?',
			options: ['Yes', 'No']
		},
		{
			q: 'Do you prefer cold or hot coffee?',
			options: ['Cold', 'Hot']
		}
	];

	function answer(option) {
		answers.push(option);
		if (step < questions.length - 1) step++;
		else calculate();
	}

	function calculate() {
		const style = answers.includes('Cold')
			? 'Cold Brew'
			: answers.includes('Strong')
				? 'Espresso'
				: answers.includes('Slow')
					? 'Pour Over'
					: 'French Press';
		result = style;
	}
</script>

<section class="mx-auto max-w-xl space-y-6 p-8">
	<h1 class="text-2xl font-bold">Brew Guide Quiz</h1>

	{#if result}
		<div class="text-center">
			<p class="text-lg">You should try:</p>
			<h2 class="mt-2 text-3xl font-bold">{result}</h2>
		</div>
	{:else}
		<div class="space-y-4">
			<p class="text-lg font-semibold">{questions[step].q}</p>
			<div class="space-y-2">
				{#each questions[step].options as opt}
					<button class="btn btn-outline w-full" on:click={() => answer(opt)}>{opt}</button>
				{/each}
			</div>
		</div>
	{/if}
</section>
