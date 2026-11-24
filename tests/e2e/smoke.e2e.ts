import { expect, test } from "@playwright/test";
import { navSections } from "../../src/content/navigation";
import { diagnosticsContent } from "../../src/content/diagnostics";
import { libraryContent } from "../../src/content/library";

// Mirrors the hand-authored hero in src/pages/index.astro. A smoke test should
// pin the headline: if the front door loses its copy, that is a regression.
const HERO_HEADING = "Who has to change it?";
const PRIMARY_NAV_SECTIONS = navSections.map((section) => section.heading);
const FIRST_NAV_TARGET = navSections[0]?.links[0];
const BURDEN_TOOL = diagnosticsContent.tools.find(
  (tool) => tool.slug === "burden-modeler",
);
const MECHANISM_WITH_DIAGNOSTICS = libraryContent.patterns.entries.find(
  (pattern) => pattern.diagnostics.length > 0,
);

if (!FIRST_NAV_TARGET) {
  throw new Error("Navigation sections are missing; check navSections.");
}

if (!BURDEN_TOOL) {
  throw new Error(
    "Burden Modeler diagnostic tool is missing; check diagnostics content.",
  );
}

const LAST_NAV_SECTION = navSections[navSections.length - 1];
const LAST_DRAWER_LINK =
  LAST_NAV_SECTION?.links[LAST_NAV_SECTION.links.length - 1];

if (!LAST_DRAWER_LINK) {
  throw new Error("Navigation sections are missing; check navSections.");
}

test.describe("Homepage smoke", () => {
  test("shows the primary hero content", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: HERO_HEADING }),
    ).toBeVisible();

    // The two ways on from the first screen, and where each one goes: the
    // self-test further down the page, and triage for a failure in progress.
    const selfTest = page.getByRole("link", {
      name: "Check your system",
      exact: true,
    });
    await expect(selfTest).toBeVisible();
    await expect(selfTest).toHaveAttribute("href", "#self-test");

    const triage = page.getByRole("link", {
      name: "Something going wrong now? First steps",
    });
    await expect(triage).toBeVisible();
    await expect(triage).toHaveAttribute("href", "/triage");
  });
});

test("serves an XML RSS feed", async ({ request }) => {
  const rss = await request.get("/rss.xml");

  expect(rss.ok()).toBeTruthy();
  expect(rss.headers()["content-type"]).toContain("xml");

  const body = await rss.text();
  expect(body).toContain("<rss");
});

test("serves the change feed", async ({ request }) => {
  const feed = await request.get("/changes.xml");

  expect(feed.ok()).toBeTruthy();
  expect(feed.headers()["content-type"]).toContain("xml");

  const body = await feed.text();
  expect(body).toContain("<title>Ethotechnics changes</title>");
  expect(body).toContain("<item>");
});

test.describe("Navigation", () => {
  test("opens the mobile drawer, expands sections, and navigates to the first link", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Brand wordmark and Start here stay visible in the phone bar.
    await expect(page.locator(".nav__wordmark")).toBeVisible();
    await expect(page.locator(".nav__start-btn")).toBeVisible();

    const drawer = page.locator("[data-nav-drawer]");
    await expect(drawer).not.toHaveAttribute("open", "");

    await page.locator("[data-nav-drawer-open]").click();
    await expect(drawer).toHaveAttribute("open", "");

    // Expand every collapsed section so all destinations are reachable.
    for (const section of navSections) {
      const trigger = drawer.locator(
        `[data-drawer-accordion-trigger][aria-controls="nav-drawer-panel-${section.id}"]`,
      );
      await expect(trigger).toBeVisible();
      if ((await trigger.getAttribute("aria-expanded")) !== "true") {
        await trigger.click();
      }
      if (section.href) {
        await expect(
          drawer.locator(`a[href="${section.href}"]`).first(),
        ).toBeVisible();
      }
      for (const link of section.links) {
        await expect(
          drawer.locator(`a[href="${link.href}"]`).first(),
        ).toBeVisible();
      }
    }

    await drawer.locator(`a[href="${FIRST_NAV_TARGET.href}"]`).first().click();
    await page.waitForURL(FIRST_NAV_TARGET.href);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /method/i,
      }),
    ).toBeVisible();
  });

  test("keeps every drawer destination reachable and dismissible on a phone", async ({
    page,
  }) => {
    const viewport = { width: 375, height: 812 };
    await page.setViewportSize(viewport);
    await page.goto("/");

    await page.locator("[data-nav-drawer-open]").click();
    const drawer = page.locator("[data-nav-drawer]");
    const sheet = drawer.locator("[data-nav-drawer-sheet]");
    await expect(sheet).toBeVisible();

    // Expand the last section (Knowledge) and confirm its final link scrolls
    // cleanly into the viewport inside the drawer body.
    const lastTrigger = drawer.locator(
      `[data-drawer-accordion-trigger][aria-controls="nav-drawer-panel-${LAST_NAV_SECTION!.id}"]`,
    );
    await lastTrigger.click();

    const lastLink = sheet.getByRole("link", {
      name: LAST_DRAWER_LINK.label,
    });
    await lastLink.scrollIntoViewIfNeeded();

    const withinViewport = await lastLink.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    expect(withinViewport).toBe(true);

    // Dismissing via the explicit close button closes the modal dialog.
    await drawer.locator("[data-nav-drawer-close]").click();
    await expect(drawer).not.toHaveAttribute("open", "");
  });

  test("shows all four section menus and Start here on desktop without opening a drawer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const desktopNav = page.locator(".nav__primary");
    await expect(desktopNav).toBeVisible();

    for (const heading of PRIMARY_NAV_SECTIONS) {
      await expect(
        desktopNav.getByRole("button", { name: heading }),
      ).toBeVisible();
    }

    await expect(page.locator(".nav__start-btn")).toBeVisible();
    await expect(page.locator("[data-nav-drawer-open]")).toBeHidden();
  });
});

test.describe("Diagnostics page", () => {
  test("surfaces primary CTAs and example outputs", async ({ page }) => {
    await page.goto("/diagnostics");

    // Each tool is listed once, as a question card that links to it. Sample
    // output lives on the tool's own page.
    await expect(
      page.getByRole("link", { name: BURDEN_TOOL.ctaLabel }).first(),
    ).toBeVisible();
    // Every one of them must point at the tool.
    const ctaLinks = page.getByRole("link", { name: BURDEN_TOOL.ctaLabel });
    for (let i = 0; i < (await ctaLinks.count()); i++) {
      await expect(ctaLinks.nth(i)).toHaveAttribute(
        "href",
        `/diagnostics/${BURDEN_TOOL.slug}`,
      );
    }
    await page.goto(`/diagnostics/${BURDEN_TOOL.slug}`);
    await expect(
      page.getByRole("link", { name: BURDEN_TOOL.exampleLabel }).first(),
    ).toBeVisible();
  });
});

test.describe("Mechanisms library", () => {
  test("leads from a pattern card to copyable diagnostic links", async ({
    page,
  }) => {
    if (!MECHANISM_WITH_DIAGNOSTICS) {
      throw new Error("No mechanism lists a diagnostic; check library.json.");
    }
    const { slug, title, diagnostics } = MECHANISM_WITH_DIAGNOSTICS;
    const tool = diagnosticsContent.tools.find(
      (entry) => entry.slug === diagnostics[0],
    );
    if (!tool) {
      throw new Error(`${slug} lists an unknown diagnostic: ${diagnostics[0]}`);
    }
    await page.goto("/mechanisms");

    // A catalog card is its title and summary. The diagnostics and their
    // copy buttons live on the mechanism's own page.
    await page
      .locator(`[data-pattern-card][id="${slug}"]`)
      .getByRole("link", { name: title })
      .click();
    await expect(page).toHaveURL(`/mechanisms/patterns/${slug}`);
    await expect(
      page
        .locator("#diagnostics")
        .getByRole("button", { name: `Copy link to ${tool.title}` }),
    ).toBeVisible();
  });

  test("copies diagnostic links that resolve from a mechanism page", async ({
    page,
    request,
  }) => {
    if (!MECHANISM_WITH_DIAGNOSTICS) {
      throw new Error("No mechanism lists a diagnostic; check library.json.");
    }
    await page.goto(`/mechanisms/patterns/${MECHANISM_WITH_DIAGNOSTICS.slug}`);

    // These links pointed at /validators/<slug>, which 404s for every tool
    // except burden-modeler. The tools live under /diagnostics.
    const targets = await page
      .locator("#diagnostics [data-copy-link]")
      .evaluateAll((buttons) =>
        buttons.map((button) => button.getAttribute("data-copy-link") ?? ""),
      );
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      const response = await request.get(target);
      expect(response.status(), `${target} should resolve`).toBe(200);
    }
  });
});
