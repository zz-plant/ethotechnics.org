import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES_TO_TEST = [
  '/',
  '/standards/std-01-temporal-rights',
  '/validators/latency-audit',
  '/institute',
  '/start-here'
];

test.describe('Accessibility (A11y) Checks', () => {
  for (const route of ROUTES_TO_TEST) {
    test(`check a11y on ${route}`, async ({ page }) => {
      await page.goto(route);
      
      // Inject some wait to ensure client-side hydration or specific UI states settled if needed
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
