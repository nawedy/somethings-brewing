<script>
	import { onMount } from 'svelte';
</script>

<nav class="bg-base-200 flex items-center gap-4 p-4 shadow">
	<a class="btn btn-ghost text-lg normal-case" href="/admin">Admin</a>
	<a class="link" href="/admin/orders">Orders</a>
	<a class="link" href="/admin/products">Products</a>
	<a class="link" href="/admin/analytics">Analytics</a>
	<a class="link" href="/admin/email-logs">Emails</a>
</nav>

<slot />
