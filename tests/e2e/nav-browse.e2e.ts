import { expect, test } from "@playwright/test";

import { navSections } from "../../src/content/navigation";

/**
 * Sitewide navigation: desktop section popovers, responsive bar fit across
 * phone/tablet/desktop viewports, active-section state, and scroll auto-hide.
 */

test.describe("Desktop section navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("opens each section popover with all links and closes the previous one", async ({
    page,
  }) => {
    await page.goto("/method");

    for (const section of navSections) {
      const trigger = page.locator(
        `[data-nav-trigger][aria-controls="nav-panel-${section.id}"]`,
      );
      const popover = page.locator(`#nav-panel-${section.id}`);

      await expect(popover).toBeHidden();
      await trigger.click();
      await expect(popover).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      if (section.href) {
        await expect(
          popover.locator(`a[href="${section.href}"]`).first(),
        ).toBeVisible();
      }
      for (const link of section.links) {
        await expect(
          popover.locator(`a[href="${link.href}"]`).first(),
        ).toBeVisible();
      }
    }

    // Opening the last section (Knowledge) automatically dismissed Method.
    await expect(page.locator("#nav-panel-method")).toBeHidden();
    await expect(
      page.locator('[data-nav-trigger][aria-controls="nav-panel-method"]'),
    ).toHaveAttribute("aria-expanded", "false");
  });

  test("closes an open popover on Escape and returns focus to its trigger", async ({
    page,
  }) => {
    await page.goto("/method");
    const trigger = page.locator(
      '[data-nav-trigger][aria-controls="nav-panel-method"]',
    );
    const popover = page.locator("#nav-panel-method");

    await trigger.click();
    await expect(popover).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(popover).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("closes an open popover on click outside", async ({ page }) => {
    await page.goto("/method");
    const trigger = page.locator(
      '[data-nav-trigger][aria-controls="nav-panel-method"]',
    );
    const popover = page.locator("#nav-panel-method");

    await trigger.click();
    await expect(popover).toBeVisible();

    await page.mouse.click(20, 700);
    await expect(popover).toBeHidden();
  });

  test("marks the active section across nested routes", async ({ page }) => {
    const cases: Array<{ route: string; activeId: string }> = [
      { route: "/standards/std-01-temporal-rights", activeId: "method" },
      { route: "/evals", activeId: "mechanisms" },
      { route: "/diagnostics/delegation-audit", activeId: "diagnostics" },
      { route: "/glossary", activeId: "knowledge" },
    ];

    for (const { route, activeId } of cases) {
      await page.goto(route);
      for (const section of navSections) {
        const trigger = page.locator(
          `[data-nav-trigger][aria-controls="nav-panel-${section.id}"]`,
        );
        if (section.id === activeId) {
          await expect(trigger).toHaveAttribute("data-section-active", "true");
        } else {
          await expect(trigger).not.toHaveAttribute(
            "data-section-active",
            "true",
          );
        }
      }
    }
  });

  for (const width of [
    320, 375, 480, 768, 1024, 1100, 1280, 1440, 1600, 1920,
  ]) {
    test(`the header fits its container at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/method");

      const spill = await page.evaluate(() => {
        const inner = document.querySelector(".nav__inner");
        if (!inner) throw new Error("no nav inner");
        const right = inner.getBoundingClientRect().right;
        const items = [...inner.children].filter(
          (el) => getComputedStyle(el).display !== "none",
        );
        const furthest = Math.max(
          ...items.map((el) => el.getBoundingClientRect().right),
        );
        return Math.round(furthest - right);
      });

      expect(
        spill,
        `nav items spill ${spill}px past the container`,
      ).toBeLessThanOrEqual(1);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        ),
        "the page scrolls horizontally",
      ).toBe(false);
    });
  }

  test("shows the full search pill on 1280px laptops", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/method");

    await expect(page.locator(".nav__search .search-label")).toBeVisible();
    await expect(page.locator(".nav__search .search-kbd")).toBeVisible();
  });

  test("popover stays within a short viewport and scrolls internally", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 420 });
    await page.goto("/method");

    await page
      .locator('[data-nav-trigger][aria-controls="nav-panel-method"]')
      .click();

    const surface = page.locator("#nav-panel-method .nav__popover-surface");
    await expect(surface).toBeVisible();

    const state = await surface.evaluate((el) => ({
      withinViewport: el.getBoundingClientRect().bottom <= window.innerHeight,
      scrolls: el.scrollHeight > el.clientHeight,
    }));
    expect(state.withinViewport).toBe(true);
    expect(state.scrolls).toBe(true);
  });

  test("hides the header while scrolling down and reveals it on scroll up", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/method");

    const nav = page.locator("[data-nav]");
    const initialBottom = await nav.evaluate(
      (el) => el.getBoundingClientRect().bottom,
    );
    expect(initialBottom).toBeGreaterThan(0);

    // Scroll down in steps so both CSS scroll-state and scroll-listener fallback
    // detect a downward gesture.
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(350);

    await expect
      .poll(async () =>
        nav.evaluate((el) => Math.round(el.getBoundingClientRect().bottom)),
      )
      .toBeLessThanOrEqual(2);

    // Scroll back up to bring the header back into view.
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(350);

    await expect
      .poll(async () =>
        nav.evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      )
      .toBeGreaterThanOrEqual(-1);
  });
});
