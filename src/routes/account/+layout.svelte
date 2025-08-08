<!-- Purpose: Shared layout for all /account pages -->

<script></script>

<section class="bg-base-200 flex items-center justify-between p-4">
	<h2 class="text-xl font-semibold">My Account</h2>
	<nav class="flex gap-4 text-sm">
		<a class="link" href="/account">Dashboard</a>
		<a class="link" href="/account/orders">Orders</a>
		<a class="link" href="/account/subscriptions">Subscriptions</a>
		<a class="link" href="/account/settings">Settings</a>
	</nav>
</section>

<main class="p-6">
	<slot />
</main>
