// File: src/lib/csrf.js
// Purpose: Helper to attach CSRF header for mutating requests

export function getCookie(name) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

export function csrfHeaders() {
  const token = getCookie('csrf-token');
  return token ? { 'X-CSRF-Token': token } : {};
}


