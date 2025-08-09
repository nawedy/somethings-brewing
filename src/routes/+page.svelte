<!-- Purpose: Homepage showcasing brand, brew quiz, products, testimonials, FAQs -->

<script>
	import Hero from '$components/Hero.svelte';
	import BrewGuideQuiz from '$components/BrewGuideQuiz.svelte';
	import FeaturedProducts from '$components/FeaturedProducts.svelte';
	import ProductShowcase from '$components/ProductShowcase.svelte';
	import Testimonials from '$components/Testimonials.svelte';
	import FAQ from '$components/FAQ.svelte';
	import ContactForm from '$components/ContactForm.svelte';
  import Section from '$components/layout/Section.svelte';
</script>

<svelte:head>
	<title>Welcome to Something’s Brewing – Discover Your Roast</title>
	<meta
		name="description"
		content="Take our quiz, explore fresh roasts, and enjoy curated coffee delivered to your door. Your coffee ritual starts here."
	/>
	<link rel="canonical" href="https://somethingsbrewing.com/" />
</svelte:head>

<main class="space-y-0">
  <Hero />
  <Section id="quiz" variant="muted">
    <BrewGuideQuiz />
  </Section>
  <Section id="showcase" variant="default">
    <ProductShowcase />
  </Section>
  <Section id="featured" variant="contrast">
    <FeaturedProducts />
  </Section>
  <Section id="testimonials" variant="default">
    <Testimonials />
  </Section>
  <Section id="faq" variant="muted">
    <FAQ />
  </Section>
  <Section id="contact" variant="default">
    <ContactForm />
  </Section>
</main>
