// File: src/routes/robots.txt/+server.ts
// Purpose: Serve robots.txt with sitemap reference for production SEO

export const prerender = true;

export const GET = async () => {
  const body = `User-agent: *
Allow: /
Sitemap: https://www.somethingsbrewing.com/sitemap.xml`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};


