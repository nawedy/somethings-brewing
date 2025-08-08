<script>
	let links = [
		{
			code: 'BREW10',
			url: 'https://somethingbrewing.com/?ref=brew10',
			clicks: 120,
			conversions: 12
		},
		{
			code: 'MORNING20',
			url: 'https://somethingbrewing.com/?ref=morning20',
			clicks: 80,
			conversions: 6
		}
	];
</script>

<section class="space-y-6 p-8">
	<h1 class="text-2xl font-bold">Affiliate Links</h1>

	<table class="table w-full">
		<thead>
			<tr>
				<th>Code</th>
				<th>Link</th>
				<th>Clicks</th>
				<th>Conversions</th>
			</tr>
		</thead>
		<tbody>
			{#each links as link}
				<tr>
					<td>{link.code}</td>
					<td>
						<a href={link.url} class="link" target="_blank">{link.url}</a>
					</td>
					<td>{link.clicks}</td>
					<td>{link.conversions}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
