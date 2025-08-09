// src/types/global.d.ts
// Global ambient type declarations (browser and library augmentations)

export {};

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      target: string,
      params?: Record<string, unknown>
    ) => void;
  }
}


