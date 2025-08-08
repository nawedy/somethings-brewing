<!-- File: src/components/Footer.svelte -->
<!-- Purpose: Footer with logo, links, newsletter, and bottom social/copyright -->

<script>
	// No JS logic needed
</script>

<footer class="footer bg-neutral text-neutral-content p-10">
	<!-- Logo and brand info -->
	<div>
		<img src="$images/Logos/logo.svg" alt="Logo" class="w-16" />
		<p>Something’s Brewing Ltd.<br />Crafted with love & caffeine</p>
	</div>

	<!-- Quick links -->
	<div>
		<span class="footer-title">Quick Links</span>
        <a class="link link-hover" href="/products">Shop</a>
        <a class="link link-hover" href="/blog">Blog</a>
        <a class="link link-hover" href="/brew-guide">Brew Guide</a>
	</div>

	<!-- Resources -->
	<div>
		<span class="footer-title">Resources</span>
        <a class="link link-hover" href="/faq">FAQ</a>
        <a class="link link-hover" href="/support">Support</a>
        <a class="link link-hover" href="/terms">Terms</a>
	</div>

	<!-- Newsletter signup -->
	<div>
		<span class="footer-title">Newsletter</span>
		<div class="form-control w-80">
            <label class="label" for="newsletter-email">
                <span class="label-text text-white" id="newsletter-label">Enter your email address</span>
            </label>
			<div class="relative">
                <input
					type="email"
					placeholder="username@site.com"
                  class="input input-bordered w-full pr-16"
                  aria-labelledby="newsletter-label"
                  id="newsletter-email"
				/>
                <button class="btn btn-primary absolute top-0 right-0 rounded-l-none" aria-label="Subscribe to newsletter">Subscribe</button>
			</div>
		</div>
	</div>

	<!-- Bottom bar -->
	<div class="mt-10 flex w-full flex-col justify-between border-t pt-4 text-sm md:flex-row">
		<span>© 2025 Something’s Brewing. All rights reserved.</span>
        <div class="mt-2 flex gap-4 md:mt-0" aria-label="Social links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
		</div>
	</div>
</footer>
