import { expect, test } from "@playwright/test";

import { navSections } from "../../src/content/navigation";

/**
 * The desktop browse panel.
 *
 * The four sections and their described links used to render only in the
 * mobile drawer, so the widest viewport saw the least. These cases assert the
 * panel carries the same map, and that it behaves like a menu rather than a
 * box that stays open behind the reader's next click.
 */

test.describe("Desktop browse panel", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("opens with every section and its described links", async ({ page }) => {
    await page.goto("/method");

    const panel = page.locator("[data-nav-browse]");
    await expect(panel.locator(".nav__browse-panel")).toBeHidden();

    await panel.locator("summary").click();
    await expect(panel.locator(".nav__browse-panel")).toBeVisible();

    for (const section of navSections) {
      await expect(
        panel.getByText(section.heading, { exact: true }),
      ).toBeVisible();
      for (const link of section.links) {
        await expect(
          panel.locator(`a[href="${link.href}"]`).first(),
        ).toBeVisible();
      }
    }
  });

  test("closes on Escape and returns focus to the trigger", async ({
    page,
  }) => {
    await page.goto("/method");
    const panel = page.locator("[data-nav-browse]");
    const summary = panel.locator("summary");

    await summary.click();
    await expect(panel.locator(".nav__browse-panel")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel.locator(".nav__browse-panel")).toBeHidden();
    await expect(summary).toBeFocused();
  });

  test("closes on a click outside", async ({ page }) => {
    await page.goto("/method");
    const panel = page.locator("[data-nav-browse]");

    await panel.locator("summary").click();
    await expect(panel.locator(".nav__browse-panel")).toBeVisible();

    // A point outside the container and below the panel. Clicking page content
    // by selector does not work here: the open panel overlays it, which is the
    // whole reason click-outside has to close it.
    await page.mouse.click(20, 700);
    await expect(panel.locator(".nav__browse-panel")).toBeHidden();
  });

  test("the primary destinations stay visible without opening it", async ({
    page,
  }) => {
    // The panel is an addition, not a replacement: hiding the fast path behind
    // a menu would be a worse nav than the one it improves on.
    await page.goto("/method");
    for (const href of [
      "/method",
      "/standards",
      "/mechanisms",
      "/diagnostics",
    ]) {
      await expect(
        page.locator(`.nav__links--desktop a[href="${href}"]`),
      ).toBeVisible();
    }
  });
});
