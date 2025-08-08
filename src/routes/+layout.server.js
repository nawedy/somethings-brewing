// File: src/routes/+layout.server.js
// Purpose: Set cache headers for static pages and assets

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  return {};
}

export const prerender = false;

// Note: Response cache headers are applied via the global handle in hooks.server.js


