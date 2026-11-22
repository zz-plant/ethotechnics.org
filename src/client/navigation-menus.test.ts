import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { initializeNavigationMenus } from "./navigation-menus";

const renderNavFixture = () => {
  document.body.innerHTML = `
    <header class="nav" data-nav>
      <nav aria-label="Primary">
        <ul>
          <li data-nav-section>
            <button
              type="button"
              popovertarget="nav-panel-method"
              aria-controls="nav-panel-method"
              aria-expanded="false"
              data-nav-trigger
            >
              Method
            </button>
            <div id="nav-panel-method" popover="auto" data-nav-popover>
              <a href="/method">The method</a>
            </div>
          </li>
          <li data-nav-section>
            <button
              type="button"
              popovertarget="nav-panel-knowledge"
              aria-controls="nav-panel-knowledge"
              aria-expanded="false"
              data-nav-trigger
            >
              Knowledge
            </button>
            <div id="nav-panel-knowledge" popover="auto" data-nav-popover>
              <a href="/glossary">Glossary</a>
            </div>
          </li>
        </ul>
      </nav>
      <button
        type="button"
        aria-controls="nav-drawer"
        aria-expanded="false"
        data-nav-drawer-open
      >
        Menu
      </button>
    </header>

    <dialog id="nav-drawer" data-nav-drawer>
      <div data-nav-drawer-scroller>
        <div data-nav-drawer-sheet>
          <button type="button" data-nav-drawer-close>Close</button>
          <div data-drawer-section data-default-open="true">
            <button
              type="button"
              aria-expanded="true"
              aria-controls="drawer-panel-method"
              data-drawer-accordion-trigger
            >
              Method
            </button>
            <div id="drawer-panel-method" data-drawer-accordion-panel>
              <a href="/method">The method</a>
            </div>
          </div>
          <div data-drawer-section data-default-open="false">
            <button
              type="button"
              aria-expanded="true"
              aria-controls="drawer-panel-knowledge"
              data-drawer-accordion-trigger
            >
              Knowledge
            </button>
            <div id="drawer-panel-knowledge" data-drawer-accordion-panel>
              <a href="/glossary">Glossary</a>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  `;
};

describe("navigation menus", () => {
  beforeEach(() => {
    renderNavFixture();
    initializeNavigationMenus();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.classList.remove("nav--hidden");
  });

  it("collapses non-default drawer sections on boot and toggles them on click", () => {
    const methodTrigger = document.querySelector<HTMLButtonElement>(
      '[aria-controls="drawer-panel-method"]',
    )!;
    const methodPanel = document.getElementById("drawer-panel-method")!;
    const knowledgeTrigger = document.querySelector<HTMLButtonElement>(
      '[aria-controls="drawer-panel-knowledge"]',
    )!;
    const knowledgePanel = document.getElementById("drawer-panel-knowledge")!;

    expect(methodTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(methodPanel.hidden).toBe(false);
    expect(knowledgeTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(knowledgePanel.hidden).toBe(true);

    knowledgeTrigger.click();
    expect(knowledgeTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(knowledgePanel.hidden).toBe(false);

    knowledgeTrigger.click();
    expect(knowledgeTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(knowledgePanel.hidden).toBe(true);
  });

  it("opens and closes the modal navigation drawer and keeps aria-expanded in sync", () => {
    const openBtn = document.querySelector<HTMLButtonElement>(
      "[data-nav-drawer-open]",
    )!;
    const closeBtn = document.querySelector<HTMLButtonElement>(
      "[data-nav-drawer-close]",
    )!;
    const drawer =
      document.querySelector<HTMLDialogElement>("[data-nav-drawer]")!;

    expect(drawer.open).toBe(false);
    expect(openBtn.getAttribute("aria-expanded")).toBe("false");

    openBtn.click();
    expect(drawer.open).toBe(true);
    expect(openBtn.getAttribute("aria-expanded")).toBe("true");

    closeBtn.click();
    expect(drawer.open).toBe(false);
    expect(openBtn.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the drawer when clicking the dimmed area outside the sheet", () => {
    const openBtn = document.querySelector<HTMLButtonElement>(
      "[data-nav-drawer-open]",
    )!;
    const drawer =
      document.querySelector<HTMLDialogElement>("[data-nav-drawer]")!;

    openBtn.click();
    expect(drawer.open).toBe(true);

    drawer.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(drawer.open).toBe(false);
    expect(openBtn.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles desktop section popovers and updates aria-expanded", () => {
    const methodTrigger = document.querySelector<HTMLButtonElement>(
      '[aria-controls="nav-panel-method"]',
    )!;
    const methodPopover = document.getElementById("nav-panel-method")!;
    const knowledgeTrigger = document.querySelector<HTMLButtonElement>(
      '[aria-controls="nav-panel-knowledge"]',
    )!;
    const knowledgePopover = document.getElementById("nav-panel-knowledge")!;

    if (Object.hasOwn(HTMLElement.prototype, "popover")) {
      const openEvent = new Event("toggle") as Event & { newState: string };
      openEvent.newState = "open";
      methodPopover.dispatchEvent(openEvent);
      expect(methodTrigger.getAttribute("aria-expanded")).toBe("true");

      const closeEvent = new Event("toggle") as Event & { newState: string };
      closeEvent.newState = "closed";
      methodPopover.dispatchEvent(closeEvent);
      expect(methodTrigger.getAttribute("aria-expanded")).toBe("false");
    } else {
      methodTrigger.click();
      expect(methodTrigger.getAttribute("aria-expanded")).toBe("true");
      expect(methodPopover.classList.contains(":popover-open")).toBe(true);

      knowledgeTrigger.click();
      expect(methodTrigger.getAttribute("aria-expanded")).toBe("false");
      expect(methodPopover.classList.contains(":popover-open")).toBe(false);
      expect(knowledgeTrigger.getAttribute("aria-expanded")).toBe("true");
      expect(knowledgePopover.classList.contains(":popover-open")).toBe(true);
    }
  });
});
