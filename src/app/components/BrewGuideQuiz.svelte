<!-- File: src/lib/components/BrewGuideQuizSection.svelte -->
<!-- Purpose: Interactive section inviting users to take a Brew Guide Quiz -->

<section class="w-full bg-[#2B100E] px-6 py-16 md:px-20">
	<div class="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-3">
		<!-- Left: Quiz CTA -->
		<div class="text-left">
			<h2 class="text-cream mb-4 text-4xl font-bold">
				Brew Guide <br /> Quiz
			</h2>
			<a
				href="/brew-guide/quiz"
				class="btn btn-lg mt-4 bg-[#EAD9C7] text-[#2B100E] shadow-lg transition hover:bg-[#D9C0A9]"
			>
				Get Started
			</a>
		</div>

		<!-- Center: Description + Icon -->
		<div class="max-w-md text-[#D9C0A9]">
			<div
				class="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C49A6C]"
			>
				<span class="text-xl">☕</span>
			</div>
			<p class="text-base leading-relaxed">
				Answer a few fun questions and we’ll recommend a brew method and roast just for you.
				Discover what suits your taste with our personalized brewing guide.
			</p>
		</div>

		<!-- Right: Brew Guide Card -->
		<div class="text-cream rounded-xl border border-[#C49A6C] bg-[#3b2f2f] p-6 shadow-inner">
			<h3 class="mb-2 text-2xl font-semibold">Brew Guide</h3>
			<p class="text-sm leading-relaxed text-[#EAD9C7]">
				Unlock the secrets of pour-over, espresso, French press and more. Elevate your coffee
				ritual.
			</p>
		</div>
	</div>
</section>

<style>
	.text-cream {
		color: #f5e9dd;
	}
</style>
