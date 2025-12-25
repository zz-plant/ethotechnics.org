/// <reference types="astro/client" />
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

import BaseLayout from "../../layouts/BaseLayout.astro";
import { createAstroContainer, parseHtml } from "../../test/astro-container";
import NavigationShell from "./NavigationShell.astro";
import { initNavigation } from "../../scripts/navigation";

const resetGlobals = () => {
  // @ts-expect-error cleaning up test globals
  delete globalThis.window;
  // @ts-expect-error cleaning up test globals
  delete globalThis.document;
};

const bootNavigation = async (html: string, innerWidth: number) => {
  const dom = new JSDOM(html, { url: "https://ethotechnics.org/", pretendToBeVisual: true });

  Object.defineProperty(dom.window, "innerWidth", {
    writable: true,
    configurable: true,
    value: innerWidth,
  });

  globalThis.window = dom.window as unknown as typeof globalThis.window;
  globalThis.document = dom.window.document;

  initNavigation();

  return dom;
};

describe("Navigation component", () => {
  it("renders expected links and navigation script for interaction", async () => {
    const container = await createAstroContainer();
    const html = await container.renderToString(NavigationShell, {
      request: new Request("https://ethotechnics.org/"),
    });
    const document = parseHtml(html);
    const nav = document.querySelector("nav.nav");

    expect(nav).toBeTruthy();
    expect(nav?.querySelector(".nav__brand")?.textContent?.trim()).toBe(
      "Ethotechnics",
    );

    const toggle = nav?.querySelector(".nav__toggle");
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    expect(toggle?.getAttribute("aria-label")).toBe("Open navigation");

    const linkTexts = Array.from(
      nav?.querySelectorAll(".nav__content .nav__link-label") ?? [],
    ).map((link) => link.textContent?.trim());
    expect(linkTexts).toEqual([
      "Library",
      "Glossary",
      "Field notes",
      "Institute",
      "Research",
      "Finite [Beta]",
      "Diagnostics",
    ]);

    const actionTexts = Array.from(
      nav?.querySelectorAll(".nav__content .nav__actions a") ?? [],
    ).map((link) => link.textContent?.trim());
    expect(actionTexts).toEqual([
      "Join the Institute",
      "Read field notes",
      "Signals newsletter",
    ]);

    const scriptSrc = document
      .querySelector<HTMLScriptElement>("script[type=\"module\"][src]")
      ?.getAttribute("src");

    expect(scriptSrc).toBeTruthy();
  });

  it("keeps navigation content visible at desktop breakpoints", async () => {
    const container = await createAstroContainer();
    const html = await container.renderToString(NavigationShell, {
      request: new Request("https://ethotechnics.org/"),
    });

    const dom = await bootNavigation(html, 1000);
    const navContent = dom.window.document.querySelector<HTMLElement>(".nav__content");

    try {
      expect(navContent?.hasAttribute("hidden")).toBe(false);
      expect(navContent?.getAttribute("aria-hidden")).toBe("false");
      expect(navContent?.hasAttribute("inert")).toBe(false);
    } finally {
      resetGlobals();
    }
  });

  it("does not duplicate toggle handlers across navigation persistence", async () => {
    const container = await createAstroContainer();
    const html = await container.renderToString(NavigationShell, {
      request: new Request("https://ethotechnics.org/"),
    });

    const dom = await bootNavigation(html, 480);
    const toggle = dom.window.document.querySelector<HTMLButtonElement>(
      ".nav__toggle",
    );

    try {
      toggle?.dispatchEvent(
        new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }),
      );

      expect(toggle?.getAttribute("aria-expanded")).toBe("true");
    } finally {
      resetGlobals();
    }
  });
});

describe("BaseLayout", () => {
  it("renders SEO metadata and RSS/footer links from props", async () => {
    const container = await createAstroContainer();
    const html = await container.renderToString(BaseLayout, {
      props: {
        title: "Custom title",
        description: "Custom description",
      },
      slots: {
        default: "<section><h1>Slot heading</h1><p>Slot content</p></section>",
      },
      request: new Request("https://ethotechnics.org/library"),
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
      document
        .querySelector('meta[property="og:image:alt"]')
        ?.getAttribute("content")
        ?.includes("Ethotechnics focus areas"),
    ).toBe(true);
    expect(
      document
        .querySelector('meta[property="og:image:width"]')
        ?.getAttribute("content"),
    ).toBe("1200");
    expect(
      document
        .querySelector('meta[property="og:image:height"]')
        ?.getAttribute("content"),
    ).toBe("630");
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://ethotechnics.org/library");
    expect(
      document.querySelector('link[rel="icon"]')?.getAttribute("href"),
    ).toBe("/favicon.svg");
    expect(
      document
        .querySelector('link[type="application/rss+xml"]')
        ?.getAttribute("href"),
    ).toBe("/rss.xml");
    expect(
      document.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
    ).toBe("summary_large_image");
    expect(
      document.querySelector('meta[name="twitter:image:alt"]')?.getAttribute("content"),
    ).toBe("Linework illustration of Ethotechnics focus areas");
    expect(
      document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
    ).toBe("#f3ebe1");

    const structuredData = document
      .querySelector('script[type="application/ld+json"]')
      ?.textContent?.trim();
    expect(structuredData?.includes('Ethotechnics Institute')).toBe(true);

    const main = document.querySelector("main.page.container");
    expect(main?.querySelector("h1")?.textContent?.trim()).toBe("Slot heading");
    expect(main?.querySelector("p")?.textContent?.trim()).toBe("Slot content");

    const footerHeadings = Array.from(
      document.querySelectorAll("footer .footer__heading"),
    ).map((heading) => heading.textContent?.trim());
    expect(footerHeadings).toEqual(["Identity", "Network", "Connect"]);

    const rssLink = document.querySelector('a.footer__link[href="/rss.xml"]');
    expect(rssLink?.textContent?.trim()).toBe("RSS feed");
  });
});
