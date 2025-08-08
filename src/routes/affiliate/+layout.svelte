<!-- Purpose: Shared layout for all /affiliate dashboard pages -->

<script></script>

<section class="bg-base-200 flex items-center justify-between p-4">
	<h2 class="text-xl font-semibold">Affiliate Dashboard</h2>
	<nav class="flex gap-4 text-sm">
		<a class="link" href="/affiliate">Overview</a>
		<a class="link" href="/affiliate/links">Links</a>
		<a class="link" href="/affiliate/withdrawals">Payouts</a>
	</nav>
</section>

<main class="p-6">
	<slot />
</main>
