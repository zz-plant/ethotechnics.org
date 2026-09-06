import { expect, test } from "@playwright/test";
import { navPrimaryLinks } from "../../src/content/navigation";
import { diagnosticsContent } from "../../src/content/diagnostics";

// Mirrors the hand-authored hero in src/pages/index.astro. A smoke test should
// pin the headline: if the front door loses its copy, that is a regression.
const HERO_HEADING =
  "Make high-stakes AI easier to stop, explain, appeal, and repair";
// The desktop bar renders the primary links verbatim; the mobile menu does
// not (see the mobile test below).
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
    await expect(
      page.getByRole("link", { name: "Find my starting point" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "How the method works →" }),
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
  test("opens on mobile and navigates to the first primary link", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 480, height: 900 });
    await page.goto("/");

    const mobileNav = page.locator("[data-mobile-nav]");
    await expect(mobileNav).not.toHaveAttribute("open", "");

    await page.locator(".nav__mobile-sections-summary").click();
    await expect(mobileNav).toHaveAttribute("open", "");

    // The mobile menu renders navSections, whose link labels are more specific
    // than the primary bar's ("Knowledge" appears as "Glossary & Ontology").
    // Assert every primary DESTINATION is reachable, which is the property
    // that matters, rather than that its label is repeated verbatim.
    for (const link of navPrimaryLinks) {
      await expect(
        mobileNav.locator(`a[href^="${link.href}"]`).first(),
      ).toBeVisible();
    }

    await mobileNav
      .locator(`a[href^="${PRIMARY_NAV_TARGET.href}"]`)
      .first()
      .click();
    await page.waitForURL(PRIMARY_NAV_TARGET.href);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: new RegExp(PRIMARY_NAV_TARGET.label, "i"),
      }),
    ).toBeVisible();
  });

  test("shows top destinations on desktop without opening a menu", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const desktopNav = page.locator(".nav__links--desktop");
    await expect(desktopNav).toBeVisible();

    for (const label of PRIMARY_NAV_LINKS) {
      await expect(desktopNav.getByRole("link", { name: label })).toBeVisible();
    }

    const startBtn = page.locator(".nav__start-btn");
    await expect(startBtn).toBeVisible();
  });
});

test.describe("Diagnostics page", () => {
  test("surfaces primary CTAs and example outputs", async ({ page }) => {
    await page.goto("/diagnostics");

    // The page links each tool from several places (the most-used rail, the
    // comparison table, the tool card), so these names are not unique.
    await expect(
      page.getByRole("link", { name: BURDEN_TOOL.ctaLabel }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: BURDEN_TOOL.exampleLabel }).first(),
    ).toBeVisible();
    // Every one of them must point at the tool.
    const ctaLinks = page.getByRole("link", { name: BURDEN_TOOL.ctaLabel });
    for (let i = 0; i < (await ctaLinks.count()); i++) {
      await expect(ctaLinks.nth(i)).toHaveAttribute(
        "href",
        `/diagnostics/${BURDEN_TOOL.slug}`,
      );
    }
  });
});

test.describe("Mechanisms library", () => {
  test("offers copyable diagnostic links in pattern cards", async ({
    page,
  }) => {
    await page.goto("/mechanisms");

    await expect(
      page.getByRole("button", { name: "Copy diagnostic links" }).first(),
    ).toBeVisible();
  });
});
