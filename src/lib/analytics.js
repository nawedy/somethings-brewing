// File: src/lib/analytics.js
// Purpose: Lightweight web-vitals + GA4/console hook (console can be removed in prod)

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  // Web Vitals reporting
  import('web-vitals').then(({ onCLS, onFID, onLCP }) => {
    const report = (metric) => {
      // Send to GA4 if available
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: metric.name,
          value: Math.round(metric.value),
          non_interaction: true
        });
      }
    };
    onCLS(report);
    onFID(report);
    onLCP(report);
  });
}


