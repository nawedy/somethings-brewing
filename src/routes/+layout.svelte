<!-- Purpose: Global layout with Header and Footer for all pages -->

<script>
	import Header from '$components/Header.svelte';
	import Footer from '$components/Footer.svelte';
	import '../app.css';
  import { onMount } from 'svelte';
  import { initAnalytics } from '$lib/analytics.js';
  // Set CSRF cookie on initial load
  if (typeof document !== 'undefined') {
    if (!document.cookie.includes('csrf-token=')) {
      const token = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 32);
      document.cookie = `csrf-token=${token}; Path=/; SameSite=Lax`;
    }
  }

  onMount(() => {
    initAnalytics();
  });
</script>

<svelte:head>
	<title>Something’s Brewing | Premium Roasted Coffee & Subscriptions</title>
	<meta
		name="description"
		content="Explore premium roasted coffee from Yemen, Ethiopia, and beyond. Ethically sourced, freshly delivered. Take our Brew Guide Quiz to find your perfect roast."
	/>
	<meta
		name="keywords"
		content="coffee, yemen, ethiopia, roast, espresso, subscription, halal, mocha, brewing, sustainable"
	/>
	<meta name="author" content="Something’s Brewing" />

	<!-- Open Graph -->
	<meta property="og:title" content="Something’s Brewing | Premium Roasted Coffee" />
	<meta
		property="og:description"
		content="Find your perfect roast with ethically sourced coffee from around the world."
	/>
	<meta property="og:image" content="/og-cover.jpg" />
	<meta property="og:url" content="https://somethingsbrewing.com" />
	<meta property="og:type" content="website" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Something’s Brewing" />
	<meta
		name="twitter:description"
		content="Take our Brew Quiz and shop premium coffee. Delivered fresh."
	/>
	<meta name="twitter:image" content="/og-cover.jpg" />
  <link rel="preload" href="/images/Logos/logo.svg" as="image" />
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
  <link rel="canonical" href="https://www.somethingsbrewing.com" />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Something’s Brewing",
      "url": "https://www.somethingsbrewing.com",
      "logo": "https://www.somethingsbrewing.com/images/Logos/logo.svg"
    }
  </script>
</svelte:head>

<!-- Page Wrapper -->
<div class="flex min-h-screen flex-col bg-[#2B100E] text-[#F5E9DD]" lang="en">
	<Header />
	<slot />
	<Footer />
</div>
