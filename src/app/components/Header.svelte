<!-- File: src/lib/components/HeaderNav.svelte -->
<!-- Purpose: Reusable header/navigation bar with modern UI, animated menu and DaisyUI styling -->

<script>
	let isMenuOpen = false;
</script>

<nav class="w-full bg-gradient-to-b from-[#2B100E] to-[#422A1F] px-6 py-4 shadow-lg">
	<div class="mx-auto flex max-w-7xl items-center justify-between">
		<!-- Logo -->
		<div class="flex items-center gap-2">
			<img src="images/Logos/logo.svg" alt="Logo" class="h-14 w-14 rounded-full shadow-md" />
			<span class="text-cream-50 text-2xl font-semibold">Something's Brewing</span>
		</div>

		<!-- Desktop Menu -->
		<ul class="text-cream-50 hidden gap-8 font-medium tracking-wide md:flex">
			<li><a href="/products" class="transition duration-300 hover:text-[#C49A6C]">Products</a></li>
			<li>
				<a href="/collections" class="transition duration-300 hover:text-[#C49A6C]">Collections</a>
			</li>
			<li>
				<a href="/brew-guide" class="transition duration-300 hover:text-[#C49A6C]">Brew Guide</a>
			</li>
			<li>
				<a href="/resources" class="transition duration-300 hover:text-[#C49A6C]">Resources</a>
			</li>
			<li><a href="/contact" class="transition duration-300 hover:text-[#C49A6C]">Contact</a></li>
		</ul>

		<!-- Auth Buttons -->
		<div class="hidden gap-4 md:flex">
			<a
				href="/register"
				class="btn btn-sm btn-outline text-cream-50 border-[#C49A6C] hover:text-[#C49A6C]"
				>Register</a
			>
			<a
				href="/signin"
				class="btn btn-sm btn-primary bg-[#C49A6C] text-[#2B100E] hover:brightness-110">Sign In</a
			>
		</div>

		<!-- Mobile Menu Toggle -->
        <button class="btn btn-ghost md:hidden" aria-label="Toggle navigation menu" on:click={() => (isMenuOpen = !isMenuOpen)}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="text-cream-50 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</button>
	</div>

	<!-- Mobile Menu Dropdown -->
	{#if isMenuOpen}
		<div class="animate-fade-in mt-4 flex flex-col items-start gap-4 px-6 pb-4 md:hidden">
			<a href="/products" class="text-cream-50 hover:text-[#C49A6C]">Products</a>
			<a href="/collections" class="text-cream-50 hover:text-[#C49A6C]">Collections</a>
			<a href="/brew-guide" class="text-cream-50 hover:text-[#C49A6C]">Brew Guide</a>
			<a href="/resources" class="text-cream-50 hover:text-[#C49A6C]">Resources</a>
			<a href="/contact" class="text-cream-50 hover:text-[#C49A6C]">Contact</a>
			<hr class="w-full border-[#C49A6C]" />
			<a href="/register" class="text-cream-50 hover:text-[#C49A6C]">Register</a>
			<a href="/signin" class="text-cream-50 hover:text-[#C49A6C]">Sign In</a>
		</div>
	{/if}
</nav>

<style>
	.text-cream-50 {
		color: #f5e9dd;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.3s ease-out;
	}
</style>
