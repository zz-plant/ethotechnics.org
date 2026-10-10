import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";

describe("mobile navigation keyboard access", () => {
  let menu: HTMLDetailsElement;
  let summary: HTMLElement;
  let main: HTMLElement;

  beforeAll(async () => {
    document.body.innerHTML = `
      <details data-mobile-nav>
        <summary>Browse</summary>
        <a href="/start">Start here</a>
        <button type="button">Theme</button>
      </details>
      <main id="main-content"></main>
      <footer class="footer"></footer>`;
    menu = document.querySelector("details")!;
    summary = menu.querySelector("summary")!;
    main = document.querySelector("main")!;
    await import("./site-chrome");
  });

  beforeEach(() => {
    menu.open = true;
    menu.dispatchEvent(new Event("toggle"));
  });

  afterAll(() => {
    menu.open = false;
    menu.dispatchEvent(new Event("toggle"));
    document.body.innerHTML = "";
  });

  it("Escape closes the menu, releases the page, and restores trigger focus", () => {
    expect(main.inert).toBe(true);
    menu
      .querySelector("a")!
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    expect(menu.open).toBe(false);
    menu.dispatchEvent(new Event("toggle"));
    expect(main.inert).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(summary);
  });

  it("keeps the Browse trigger in the keyboard cycle", () => {
    const last = menu.querySelector("button")!;
    last.focus();
    last.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
    );
    expect(document.activeElement).toBe(summary);
    summary.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
      }),
    );
    expect(document.activeElement).toBe(last);
  });
});
