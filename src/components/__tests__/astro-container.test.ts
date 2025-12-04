/// <reference types="astro/client" />
import { describe, expect, it } from "vitest";

import BaseLayout from "../../layouts/BaseLayout.astro";
import { createAstroContainer, parseHtml } from "../../test/astro-container";
import NavigationShell from "./NavigationShell.astro";

describe("Navigation component", () => {
  it("renders expected links and inline script for interaction", async () => {
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
      nav?.querySelectorAll(".nav__content .nav__links a") ?? [],
    ).map((link) => link.textContent?.trim());
    expect(linkTexts).toEqual([
      "Glossary",
      "Library",
      "Research",
      "Diagnostics",
      "Field Notes",
      "Institute",
    ]);

    const actionTexts = Array.from(
      nav?.querySelectorAll(".nav__content .nav__actions a") ?? [],
    ).map((link) => link.textContent?.trim());
    expect(actionTexts).toEqual(["Field notes", "Join the institute"]);
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
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content"),
    ).toBe("Custom title");
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://ethotechnics.org/library");
    expect(
      document.querySelector('link[rel="icon"]')?.getAttribute("href"),
    ).toBe("/favicon.svg");

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
