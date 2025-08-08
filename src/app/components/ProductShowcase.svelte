<!-- File: src/lib/components/ProductShowcaseSection.svelte -->
<!-- Purpose: Showcase featured coffee bags and feature badges in a modern 4-column responsive layout -->

<section class="w-full bg-[#2B100E] px-6 py-20 md:px-20">
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Product Card 1 -->
		<div
			class="flex flex-col items-center rounded-2xl border border-[#C49A6C] bg-[#3B2F2F] p-6 shadow-md"
		>
			<img src="$images/adwa-coffee.png" alt="Adwa Coffee" class="mb-4 h-56 w-40 object-contain" />
			<h3 class="text-cream mb-2 text-xl font-bold">Adwa Roast</h3>
			<p class="text-center text-sm text-[#EAD9C7]">
				Smooth, nutty, with hints of spice and chocolate.
			</p>
			<a
				href="/products/adwa-roast"
				class="btn btn-sm mt-4 bg-[#EAD9C7] text-[#2B100E] shadow hover:bg-[#D9C0A9]">Shop Now</a
			>
		</div>

		<!-- Feature Badges Column -->
		<div class="flex flex-col items-center gap-8">
			<div
				class="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#EAD9C7] to-[#B5A18E] text-lg font-bold text-[#2B100E] shadow-inner"
			>
				Award-Winning
			</div>
			<div
				class="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#EAD9C7] to-[#C49A6C] text-lg font-bold text-[#2B100E] shadow-inner"
			>
				Small Batch
			</div>
		</div>

		<!-- Feature Badges Column -->
		<div class="flex flex-col items-center gap-8">
			<div
				class="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#EAD9C7] to-[#B5A18E] text-lg font-bold text-[#2B100E] shadow-inner"
			>
				Organic
			</div>
			<div
				class="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#EAD9C7] to-[#C49A6C] text-lg font-bold text-[#2B100E] shadow-inner"
			>
				Fair Trade
			</div>
		</div>

		<!-- Product Card 2 -->
		<div
			class="flex flex-col items-center rounded-2xl border border-[#C49A6C] bg-[#3B2F2F] p-6 shadow-md"
		>
			<img src="$images/adwa-coffee.png" alt="Mocha Blend" class="mb-4 h-56 w-40 object-contain" />
			<h3 class="text-cream mb-2 text-xl font-bold">Mocha Blend</h3>
			<p class="text-center text-sm text-[#EAD9C7]">
				Rich and bold with dark chocolate undertones.
			</p>
			<a
				href="/products/mocha-blend"
				class="btn btn-sm mt-4 bg-[#EAD9C7] text-[#2B100E] shadow hover:bg-[#D9C0A9]">Shop Now</a
			>
		</div>
	</div>
</section>

<style>
	.text-cream {
		color: #f5e9dd;
	}
</style>
