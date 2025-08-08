// File: src/lib/validation.js
// Minimal validation and sanitization helpers

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeString(value, maxLen = 512) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  const limited = trimmed.slice(0, maxLen);
  // Basic neutralization of angle brackets
  return limited.replace(/[<>]/g, '');
}

export function requireFields(body, fields) {
  for (const f of fields) {
    if (!(f in body)) return { ok: false, error: `${f} is required` };
  }
  return { ok: true };
}


