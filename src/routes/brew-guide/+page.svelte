<script>
	let methods = [
		{ name: 'Pour Over', image: '/images/guides/pour.jpg' },
		{ name: 'French Press', image: '/images/guides/french.jpg' },
		{ name: 'Espresso', image: '/images/guides/espresso.jpg' },
		{ name: 'Cold Brew', image: '/images/guides/cold.jpg' }
	];
  import Section from '$components/layout/Section.svelte';
</script>

<main>
  <Section variant="default">
    <h1 class="text-2xl font-bold">Brew Guide</h1>
    <p class="opacity-80">Explore different brewing methods to perfect your cup.</p>

    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {#each methods as m}
        <div class="card bg-base-100 shadow">
          <img src={m.image} alt={m.name} class="h-40 w-full object-cover" />
          <div class="p-4 text-center font-semibold">{m.name}</div>
        </div>
      {/each}
    </div>

    <div class="mt-8 text-center">
      <a href="/brew-guide/quiz" class="btn btn-primary">Take the Brew Quiz</a>
    </div>
  </Section>
  <Section variant="muted" />
</main>
