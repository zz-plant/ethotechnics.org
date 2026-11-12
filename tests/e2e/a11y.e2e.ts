import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES_TO_TEST = [
  "/",
  "/standards/std-01-temporal-rights",
  "/validators",
  "/about",
  "/start",
  "/explainers/governance-capability",
];

test.describe("Accessibility (A11y) Checks", () => {
  for (const route of ROUTES_TO_TEST) {
    test(`check a11y on ${route}`, async ({ page }) => {
      await page.goto(route);

      // Inject some wait to ensure client-side hydration or specific UI states settled if needed
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

// These diagrams overflow their container on phones. Keyboard users must be
// able to focus and scroll them, rather than relying on touch or a pointer.
test.describe("Diagram accessibility on phones", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const route of [
    "/standards/laws",
    "/research/theory/what-outcomes-hide",
  ]) {
    test(`check scrollable diagrams on ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);

      const diagram = page.locator(".diagram-scroll").first();
      await diagram.focus();
      await expect(diagram).toBeFocused();
      await page.keyboard.press("ArrowRight");
      await expect
        .poll(() => diagram.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
    });
  }
});

// A Markdown table wider than a phone column used to run past the screen
// edge, where the page clips it. It scrolls inside its own box now, and a
// keyboard can reach and scroll that box.
test.describe("Prose tables on phones", () => {
  test.use({ viewport: { width: 320, height: 700 } });

  test("a wide Markdown table scrolls inside the column", async ({ page }) => {
    await page.goto("/research/theory/the-consumption-of-adaptive-capacity");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);

    const box = page.locator(".prose-table").first();
    const { boxRight, viewport } = await box.evaluate((element) => ({
      boxRight: element.getBoundingClientRect().right,
      viewport: document.documentElement.clientWidth,
    }));
    expect(boxRight).toBeLessThanOrEqual(viewport);

    await box.focus();
    await expect(box).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => box.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0);
  });
});
