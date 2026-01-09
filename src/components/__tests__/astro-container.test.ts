/// <reference types="astro/client" />
import { describe, expect, it } from "bun:test";

import BaseLayout from "../../layouts/BaseLayout.astro";
import { createAstroContainer, parseHtml } from "../../test/astro-container";
import NavigationShell from "./NavigationShell.astro";

describe.skip("Navigation component", () => {
  it("renders primary and utility links without a toggle for small screens", async () => {
    const container = await createAstroContainer();
    const html = await container.renderToString(NavigationShell, {
      request: new Request("https://ethotechnics.org/"),
    });
    const document = parseHtml(html);
    const nav = document.querySelector("nav.nav");

    expect(nav).toBeTruthy();
    const brand = nav?.querySelector<HTMLAnchorElement>(".nav__brand");
    const logo = brand?.querySelector("svg");

    expect(brand?.getAttribute("aria-label")).toBe("Go to the homepage");
    expect(logo).toBeTruthy();
    expect(logo?.getAttribute("aria-label")).toBe("Ethotechnics");
    expect(logo?.querySelector("title")?.textContent).toBe("Ethotechnics");
    expect(nav?.querySelector(".nav__toggle")).toBeNull();

    const mobilePrimaryLinks = Array.from(
      nav?.querySelectorAll<HTMLAnchorElement>(".nav__mobile .nav__link") ?? [],
    )
      .map((link) => link.textContent?.trim())
      .filter(Boolean);

    expect(mobilePrimaryLinks).toEqual([
      "Standards",
      "Mechanisms",
      "Validators",
      "Institute",
    ]);

    const mobileUtilityLinks = Array.from(
      nav?.querySelectorAll<HTMLAnchorElement>(
        ".nav__utility--mobile .nav__utility-link, .nav__utility--mobile .button",
      ) ?? [],
    )
      .map((link) => link.textContent?.trim())
      .filter(Boolean);

    expect(mobileUtilityLinks).toEqual(["GitHub", "Ethotechnics Studio"]);
  });

  it("keeps the desktop navigation content visible in the DOM", async () => {
    const container = await createAstroContainer();
    const html = await container.renderToString(NavigationShell, {
      request: new Request("https://ethotechnics.org/"),
    });
    const document = parseHtml(html);
    const navContent = document.querySelector<HTMLElement>(".nav__content");

    expect(navContent).toBeTruthy();
    expect(navContent?.hasAttribute("hidden")).toBe(false);
    expect(navContent?.getAttribute("aria-hidden")).not.toBe("true");
    expect(navContent?.hasAttribute("inert")).toBe(false);

    const linkTexts = Array.from(
      navContent?.querySelectorAll(".nav__link-label") ?? [],
    ).map((link) => link.textContent?.trim());
    expect(linkTexts).toEqual([
      "Standards",
      "The Temporal Bill of Rights (STD-01)",
      "Core axioms",
      "Glossary",
      "Mechanisms",
      "Governance",
      "Friction",
      "Policy",
      "Validators",
      "Burden Modeler",
      "Risk Radar",
      "Latency Audit",
      "Institute",
      "Team",
      "Case law",
      "Studio (.com)",
    ]);

    const actionTexts = Array.from(
      navContent?.querySelectorAll(".nav__actions a") ?? [],
    ).map((link) => link.textContent?.trim());
    expect(actionTexts).toEqual([
      "Start here",
      "Join the Institute",
      "Read field notes",
      "Signals newsletter",
    ]);
  });
});

describe.skip("BaseLayout", () => {
  it("renders SEO metadata and footer links from props", async () => {
    const container = await createAstroContainer();
    const html = await container.renderToString(BaseLayout, {
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
    ).toBe("https://ethotechnics.org/mechanisms");
    expect(
      document.querySelector('link[rel="icon"]')?.getAttribute("href"),
    ).toBe("/favicon.svg");
    expect(
      document
        .querySelector('meta[name="twitter:card"]')
        ?.getAttribute("content"),
    ).toBe("summary_large_image");
    expect(
      document
        .querySelector('meta[name="twitter:image:alt"]')
        ?.getAttribute("content"),
    ).toBe("Linework illustration of Ethotechnics focus areas");
    expect(
      document
        .querySelector('meta[name="theme-color"]')
        ?.getAttribute("content"),
    ).toBe("#f0ece4");

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
    expect(footerHeadings).toEqual([
      "Identity",
      "Network",
      "Work with the Studio",
      "Connect",
    ]);
  });
});
