/// <reference types="astro/client" />
import { describe, expect, it } from "bun:test";

import BaseLayout from "../../layouts/BaseLayout.astro";
import Navigation from "../Navigation.astro";
import { createAstroContainer, parseHtml } from "../../test/astro-container";

type AstroComponentFactory = Parameters<
  Awaited<ReturnType<typeof createAstroContainer>>["renderToString"]
>[0];

const navigationComponent = Navigation as AstroComponentFactory;
const baseLayoutComponent = BaseLayout as AstroComponentFactory;

// Note: Astro container testing of .astro component factories requires the Vite transform pipeline.
// These component structures are validated via Playwright E2E suites (tests/e2e/smoke.e2e.ts).
describe.skip("Navigation component", () => {
  it("renders desktop and mobile navigation shells with primary links and actions", async () => {
    const container = await createAstroContainer();
    const html = await container.renderToString(navigationComponent, {
      request: new Request("https://ethotechnics.org/"),
    });
    const document = parseHtml(html);
    const nav = document.querySelector("nav.nav");

    expect(nav).toBeTruthy();
    const brand = nav?.querySelector<HTMLAnchorElement>(".nav__brand");
    expect(brand?.getAttribute("aria-label")).toBe("Go to the homepage");
    expect(brand?.getAttribute("href")).toBe("/");

    const desktopLinks = Array.from(
      nav?.querySelectorAll<HTMLAnchorElement>(
        ".nav__links--desktop .nav__link",
      ) ?? [],
    ).map((link) => link.textContent?.trim());

    expect(desktopLinks).toEqual([
      "Standards",
      "Tools",
      "Mechanisms",
      "Evals",
      "Library",
      "About",
    ]);

    const startBtn = nav?.querySelector<HTMLAnchorElement>(".nav__start-btn");
    expect(startBtn).toBeTruthy();
    expect(startBtn?.getAttribute("href")).toBe("/start-here");
    expect(startBtn?.textContent?.trim()).toBe("Start here");

    const githubBtn = nav?.querySelector<HTMLAnchorElement>(".nav__icon-btn");
    expect(githubBtn).toBeTruthy();
    expect(githubBtn?.getAttribute("href")).toBe(
      "https://github.com/zz-plant/ethotechnics",
    );

    const themeToggle = nav?.querySelector<HTMLButtonElement>(".theme-toggle");
    expect(themeToggle).toBeTruthy();

    const mobileDrawer = nav?.querySelector(".nav__mobile-drawer");
    expect(mobileDrawer).toBeTruthy();

    const mobileGroupTitles = Array.from(
      nav?.querySelectorAll(".nav__mobile-group-title") ?? [],
    ).map((el) => el.textContent?.trim());

    expect(mobileGroupTitles).toContain("Standards & Tools");
    expect(mobileGroupTitles).toContain("Knowledge & Reference");
    expect(mobileGroupTitles).toContain("Institute & Community");
  });
});

describe.skip("BaseLayout", () => {
  it("renders SEO metadata, main content slot, and 4-column footer", async () => {
    const container = await createAstroContainer();
    const html = await container.renderToString(baseLayoutComponent, {
      props: {
        title: "Custom title",
        description: "Custom description",
      },
      slots: {
        default: "<section><h1>Slot heading</h1><p>Slot content</p></section>",
      },
      request: new Request("https://ethotechnics.org/mechanisms"),
      partial: false,
    });
    const document = parseHtml(html);

    expect(document.querySelector("title")?.textContent).toBe("Custom title");
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
    ).toBe("Custom description");
    expect(
      document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content"),
    ).toBe("Custom description");
    expect(
      document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content"),
    ).toBe("Custom title");
    expect(
      document
        .querySelector('meta[property="og:site_name"]')
        ?.getAttribute("content"),
    ).toBe("Ethotechnics Institute");
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://ethotechnics.org/mechanisms");

    const structuredData = document
      .querySelector('script[type="application/ld+json"]')
      ?.textContent?.trim();
    expect(structuredData?.includes("Ethotechnics Institute")).toBe(true);

    const main = document.querySelector("main.page.container");
    expect(main?.querySelector("h1")?.textContent?.trim()).toBe("Slot heading");
    expect(main?.querySelector("p")?.textContent?.trim()).toBe("Slot content");

    const footerHeadings = Array.from(
      document.querySelectorAll("footer .footer__heading"),
    ).map((heading) => heading.textContent?.trim());

    expect(footerHeadings).toContain("Ethotechnics Institute");
    expect(footerHeadings).toContain("Standards & Tools");
    expect(footerHeadings).toContain("Knowledge Base");
    expect(footerHeadings).toContain("Institute & Governance");
    expect(footerHeadings).toContain("Ecosystem & Connect");
  });
});
