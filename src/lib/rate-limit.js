// File: src/lib/rate-limit.js
// Simple in-memory rate limiter keyed by IP and bucket id

const buckets = new Map();

function getClientIp(event) {
  try {
    if (typeof event.getClientAddress === 'function') return event.getClientAddress();
  } catch {}
  const xff = event.request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const ra = event.request.headers.get('x-real-ip');
  if (ra) return ra;
  try {
    return new URL(event.request.url).hostname || 'unknown';
  } catch {
    return 'unknown';
  }
}

function matchBucket(pathname) {
  const rules = [
    { test: /^\/api\/auth\/login/, id: 'auth-login', limit: 10, windowMs: 15 * 60_000 },
    { test: /^\/api\/auth\/register/, id: 'auth-register', limit: 10, windowMs: 15 * 60_000 },
    { test: /^\/api\/auth\/resend-verification/, id: 'auth-resend', limit: 5, windowMs: 15 * 60_000 },
    { test: /^\/api\/orders\/create/, id: 'orders-create', limit: 20, windowMs: 15 * 60_000 },
    { test: /^\/api\/admin\//, id: 'admin', limit: 60, windowMs: 15 * 60_000 },
    { test: /^\/api\//, id: 'api-default', limit: 100, windowMs: 15 * 60_000 }
  ];
  for (const r of rules) if (r.test.test(pathname)) return r;
  return null;
}

export async function checkRateLimit(event) {
  const pathname = new URL(event.request.url).pathname;
  const rule = matchBucket(pathname);
  if (!rule) return { allowed: true };

  const ip = getClientIp(event);
  const key = `${ip}:${rule.id}`;
  const now = Date.now();
  let entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + rule.windowMs };
    buckets.set(key, entry);
  }

  if (entry.count >= rule.limit) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSec };
  }

  entry.count += 1;
  return { allowed: true };
}


