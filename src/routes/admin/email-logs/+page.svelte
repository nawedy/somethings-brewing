<!-- File: src/routes/admin/email-logs/+page.svelte -->
<!-- Purpose: Admin view of all logged outgoing emails -->

<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	let logs = [];
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const { data, error: fetchError } = await supabase
				.from('email_logs')
				.select('*')
				.order('created_at', { ascending: false });

			if (fetchError) throw fetchError;

			logs = data;
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	});
</script>

<section class="space-y-6 p-8">
	<h1 class="text-2xl font-bold">Email Logs</h1>

	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="text-red-600">{error}</p>
	{:else if logs.length === 0}
		<p>No email logs found.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th>Recipient</th>
						<th>Subject</th>
						<th>Status</th>
						<th>Sent At</th>
					</tr>
				</thead>
				<tbody>
					{#each logs as log}
						<tr>
							<td>{log.recipient}</td>
							<td>{log.subject}</td>
							<td>
								<span class="badge {log.status === 'sent' ? 'badge-success' : 'badge-warning'}">
									{log.status}
								</span>
							</td>
							<td>{new Date(log.sent_at || log.created_at).toLocaleString()}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
