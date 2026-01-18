import { expect, test } from "@playwright/test";
import { navPrimaryLinks } from "../../src/content/navigation";
import { diagnosticsContent } from "../../src/content/diagnostics";

const HERO_HEADING =
  "Technology should serve people — not the other way around.";
const PRIMARY_NAV_LINKS = navPrimaryLinks.map((link) => link.label);
const PRIMARY_NAV_TARGET = navPrimaryLinks[0];
const BURDEN_TOOL = diagnosticsContent.tools.find(
  (tool) => tool.slug === "burden-modeler",
);

if (!PRIMARY_NAV_TARGET) {
  throw new Error("Primary navigation links are missing; check navSections.");
}

if (!BURDEN_TOOL) {
  throw new Error(
    "Burden Modeler diagnostic tool is missing; check diagnostics content.",
  );
}

test.describe("Homepage smoke", () => {
  test("shows the primary hero content", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: HERO_HEADING }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Get updates" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore focus areas" }),
    ).toBeVisible();
  });
});

test("serves an XML RSS feed", async ({ request }) => {
  const rss = await request.get("/rss.xml");

  expect(rss.ok()).toBeTruthy();
  expect(rss.headers()["content-type"]).toContain("xml");

  const body = await rss.text();
  expect(body).toContain("<rss");
});

test.describe("Navigation", () => {
  test("opens on mobile and navigates to the first primary link", async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 900 });
    await page.goto("/");

    const navContent = page.locator(".nav__content");
    const html = page.locator("html");
    await expect(navContent).not.toHaveClass(/is-open/);
    await expect(html).not.toHaveClass(/nav-locked/);

    await page.getByRole("button", { name: /open navigation/i }).click();
    await expect(navContent).toHaveClass(/is-open/);
    await expect(html).toHaveClass(/nav-locked/);

    for (const label of PRIMARY_NAV_LINKS) {
      await expect(page.getByRole("link", { name: label })).toBeVisible();
    }

    await page.getByRole("link", { name: PRIMARY_NAV_TARGET.label }).click();
    await page.waitForURL(PRIMARY_NAV_TARGET.href);

    await expect(
      page.getByRole("heading", { level: 1, name: new RegExp(PRIMARY_NAV_TARGET.label, "i") }),
    ).toBeVisible();
    await expect(page.locator(".nav__content")).not.toHaveClass(/is-open/);
    await expect(html).not.toHaveClass(/nav-locked/);
  });

  test("shows top destinations on desktop without opening the menu", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const quickNav = page.locator(".nav__quick");
    await expect(quickNav).toBeVisible();

    for (const label of PRIMARY_NAV_LINKS) {
      await expect(quickNav.getByRole("link", { name: label })).toBeVisible();
    }
  });
});

test.describe("Diagnostics page", () => {
  test("surfaces primary CTAs and example outputs", async ({ page }) => {
    await page.goto("/diagnostics");

    await expect(
      page.getByRole("link", { name: BURDEN_TOOL.ctaLabel }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: BURDEN_TOOL.exampleLabel }),
    ).toBeVisible();
  });
});

test.describe("Mechanisms library", () => {
  test("offers copyable diagnostic links in pattern cards", async ({ page }) => {
    await page.goto("/mechanisms");

    await expect(
      page.getByRole("button", { name: "Copy diagnostic links" }).first(),
    ).toBeVisible();
  });
});
