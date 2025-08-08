import { supabase } from '$lib/supabase';
import { xml } from '@sveltejs/kit';

export const GET = async () => {
	const base = 'https://www.somethingsbrewing.com';

	const [{ data: products }, { data: blogs }] = await Promise.all([
		supabase.from('products').select('slug, updated_at').eq('published', true),
		supabase.from('blogs').select('slug, updated_at').eq('published', true)
	]);

	const urls = [
		`${base}/`,
		`${base}/products`,
		`${base}/collections`,
		`${base}/blog`,
		`${base}/about`,
		`${base}/contact`,
		`${base}/brew-guide`,
		`${base}/brew-quiz`,
		...(products ?? []).map((p) => `${base}/products/${p.slug}`),
		...(blogs ?? []).map((b) => `${base}/blog/${b.slug}`)
	];

	const now = new Date().toISOString();

	const xmlContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
				.map(
					(url) => `
        <url>
          <loc>${url}</loc>
          <lastmod>${now}</lastmod>
          <changefreq>weekly</changefreq>
        </url>`
				)
				.join('')}
    </urlset>
  `.trim();

	return new Response(xmlContent, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
