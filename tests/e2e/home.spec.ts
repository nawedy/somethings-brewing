// File: tests/e2e/home.spec.ts
// Purpose: Basic E2E validation for homepage rendering and core landmarks

import { test, expect } from '@playwright/test';

test('homepage renders main content', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('main')).toBeVisible();
});

test('navigation to products page works', async ({ page }) => {
  const response = await page.goto('/products');
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('main')).toBeVisible();
});


