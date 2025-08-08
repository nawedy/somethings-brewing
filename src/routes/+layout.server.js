// File: src/routes/+layout.server.js
// Purpose: Set cache headers for static pages and assets

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  return {};
}

export const prerender = true;

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event, {
    filterSerializedResponseHeaders: (name) => name.toLowerCase() !== 'cache-control'
  });
  const pathname = new URL(event.request.url).pathname;
  if (pathname.startsWith('/images/') || pathname.startsWith('/videos/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (['/', '/products', '/blog', '/brew-guide'].includes(pathname)) {
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  }
  return response;
}


