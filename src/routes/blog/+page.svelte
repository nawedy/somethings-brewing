<!-- File: src/routes/blog/+page.svelte -->
<!-- Purpose: Blog landing page showing recent or featured posts -->

<script>
	let posts = [
		{
			slug: 'ethiopian-coffee-history',
			title: 'The History of Ethiopian Coffee',
			date: '2024-12-01',
			excerpt: 'Explore the birthplace of coffee and how Ethiopian beans changed the world.',
			image: '/images/blog1.jpg'
		},
		{
			slug: 'brew-like-a-pro',
			title: 'How to Brew Like a Pro',
			date: '2024-11-10',
			excerpt: 'Master your brewing technique with these pro-level tips.',
			image: '/images/blog2.jpg'
		}
	];
  import Section from '$components/layout/Section.svelte';
</script>

<main>
  <Section variant="default">
    <h1 class="mb-8 text-center font-serif text-4xl">Our Blog</h1>
    <div class="grid gap-8 md:grid-cols-2">
      {#each posts as post}
        <a href={`/blog/${post.slug}`} class="card bg-base-100 shadow-md transition hover:shadow-xl">
          <figure><img src={post.image} alt={post.title} class="h-48 w-full object-cover" /></figure>
          <div class="card-body">
            <h2 class="card-title">{post.title}</h2>
            <p class="text-sm text-gray-400">{post.date}</p>
            <p>{post.excerpt}</p>
          </div>
        </a>
      {/each}
    </div>
  </Section>
  <Section variant="muted" />
</main>
