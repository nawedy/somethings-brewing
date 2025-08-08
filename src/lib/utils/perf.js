// File: src/lib/utils/perf.js
// Purpose: Tiny helper to debounce expensive UI logic

export function debounce(fn, wait = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}


