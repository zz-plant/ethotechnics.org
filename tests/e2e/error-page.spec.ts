import { test, expect } from '@playwright/test';

test.describe('404 Error Page', () => {
  test('shows custom 404 content for non-existent routes', async ({ page }) => {
    // Navigate to the explicit 404 page to verify design
    const response = await page.goto('/404');
    
    // Verify 404 status code (if supported by the serving platform in this mode)
    // Note: 'bun run preview' might behave differently regarding status codes than production
    // but the content should definitely be there.
    if (response) {
      expect(response.status()).toBe(404);
    }

    // Check for specific 404 content elements
    await expect(page.locator('.page-404')).toBeVisible();
    await expect(page.getByText('404', { exact: true })).toBeVisible();
    await expect(page.getByText('Signal Lost')).toBeVisible();
    
    // Check "Return to Base" link works
    await page.getByRole('link', { name: 'Return to Base' }).click();
    await expect(page).toHaveURL(/\/$/); // Should be at root
  });
});
