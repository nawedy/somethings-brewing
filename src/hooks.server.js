import { paraglideMiddleware } from '$lib/paraglide/server';
import { checkRateLimit } from '$lib/rate-limit.js';

const handleParaglide = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
    });
  });

/** @type {import('@sveltejs/kit').Handle} */
async function handleRateLimit({ event, resolve }) {
  const { allowed, retryAfterSec } = await checkRateLimit(event);
  if (!allowed) {
    return new Response(
      JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfterSec)
        }
      }
    );
  }
  return resolve(event);
}

/** CSRF protection: double-submit cookie pattern */
async function handleCsrf({ event, resolve }) {
  const method = event.request.method.toUpperCase();
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  if (!isMutation) return resolve(event);

  // Skip CSRF for Stripe webhooks and public webhooks
  const pathname = new URL(event.request.url).pathname;
  if (pathname.startsWith('/api/webhooks/')) return resolve(event);

  const csrfCookie = event.request.headers.get('cookie')?.match(/(?:^|; )csrf-token=([^;]+)/)?.[1] || '';
  const csrfHeader = event.request.headers.get('x-csrf-token') || '';
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid CSRF token' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return resolve(event);
}

// Compose handlers: RateLimit -> CSRF -> Paraglide
export const handle = async (params) =>
  handleRateLimit({
    ...params,
    resolve: (e1) => handleCsrf({ ...params, event: e1, resolve: (e2) => handleParaglide({ event: e2, resolve: params.resolve }) })
  });
