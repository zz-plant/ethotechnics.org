import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

const resetGlobals = () => {
  // @ts-expect-error cleaning up test globals
  delete globalThis.window;
  // @ts-expect-error cleaning up test globals
  delete globalThis.document;
};

const bootstrapNavigationDom = () => {
  const dom = new JSDOM(
    `
    <nav data-nav>
      <button class="nav__toggle"><span>☰</span></button>
      <div class="nav__content">
        <div class="nav__links"><a href="#">Home</a></div>
        <div class="nav__utility"><a href="#">Utility</a></div>
        <div class="nav__actions"><a href="#">Action</a></div>
        <div class="nav__quick-links"><a href="#">Quick</a></div>
      </div>
    </nav>
    `,
    { url: "https://ethotechnics.org/", pretendToBeVisual: true },
  );

  Object.defineProperty(dom.window, "innerWidth", {
    configurable: true,
    writable: true,
    value: 480,
  });

  Object.defineProperty(dom.window.document, "readyState", {
    configurable: true,
    value: "loading",
  });

  globalThis.window = dom.window as unknown as typeof globalThis.window;
  globalThis.document = dom.window.document;

  return dom;
};

describe("navigation module", () => {
  it("auto-initializes when loaded as a module", async () => {
    vi.resetModules();
    const dom = bootstrapNavigationDom();
    const nav = dom.window.document.querySelector<HTMLElement>("[data-nav]");
    const toggle = nav?.querySelector<HTMLButtonElement>(".nav__toggle");
    const content = nav?.querySelector<HTMLElement>(".nav__content");

    await import("./navigation.ts");

    expect(nav?.dataset.initialized).toBeUndefined();

    dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));

    expect(nav?.dataset.initialized).toBe("true");
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    expect(content?.hasAttribute("hidden")).toBe(true);
    expect(content?.getAttribute("aria-hidden")).toBe("true");
    expect(content?.hasAttribute("inert")).toBe(true);

    resetGlobals();
  });
});
