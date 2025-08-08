<!-- File: src/routes/blog/[slug].svelte -->
<!-- Purpose: SEO-enhanced version of blog post page with corrected <svelte:head> placement -->

<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let post;
	let slug = $page.params.slug;

	const blogPosts = {
		'ethiopian-coffee-history': {
			title: 'The History of Ethiopian Coffee',
			content:
				'Coffee has its roots in the highlands of Ethiopia, where legend speaks of a goatherd named Kaldi...'
		},
		'brew-like-a-pro': {
			title: 'How to Brew Like a Pro',
			content: 'Perfect brewing starts with water quality, grind size, and patience...'
		}
	};

	onMount(() => {
		post = blogPosts[slug];
	});
</script>

<svelte:head>
	<title>{post?.title || 'Blog Post'} | Blog | Something’s Brewing</title>
	<meta name="description" content={post?.content?.slice(0, 150) || ''} />
	<meta property="og:title" content={post?.title || ''} />
	<meta property="og:description" content={post?.content?.slice(0, 150) || ''} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`https://www.somethingsbrewing.com/blog/${slug}`} />
	<meta property="og:image" content="https://www.somethingsbrewing.com/images/blog-cover.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={post?.title || ''} />
	<meta name="twitter:description" content={post?.content?.slice(0, 150) || ''} />
	<link rel="canonical" href={`https://www.somethingsbrewing.com/blog/${slug}`} />
</svelte:head>

{#if post}
	<section class="mx-auto max-w-4xl p-10">
		<h1 class="mb-4 font-serif text-4xl">{post.title}</h1>
		<article class="prose max-w-none">
			<p>{post.content}</p>
		</article>
	</section>
{:else}
	<p class="text-error p-10 text-center">Post not found.</p>
{/if}
