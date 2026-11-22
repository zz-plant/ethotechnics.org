import { afterAll, beforeAll, describe, expect, it } from "bun:test";

describe("theme toggle controls", () => {
  let iconToggle: HTMLButtonElement;
  let drawerToggle: HTMLButtonElement;
  let drawerToggleText: HTMLElement;

  beforeAll(async () => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.body.innerHTML = `
      <button type="button" data-theme-toggle aria-label="Toggle theme"></button>
      <button type="button" data-theme-toggle aria-label="Toggle theme">
        <span data-theme-toggle-text>Switch theme</span>
      </button>`;
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      "[data-theme-toggle]",
    );
    iconToggle = buttons[0]!;
    drawerToggle = buttons[1]!;
    drawerToggleText = drawerToggle.querySelector<HTMLElement>(
      "[data-theme-toggle-text]",
    )!;
    await import("./site-chrome");
  });

  afterAll(() => {
    document.body.innerHTML = "";
    document.documentElement.classList.remove("dark", "light");
  });

  it("syncs aria-label and visible label text across both theme buttons", () => {
    expect(iconToggle.getAttribute("aria-label")).toBe("Switch to dark theme");
    expect(drawerToggle.getAttribute("aria-label")).toBe(
      "Switch to dark theme",
    );
    expect(drawerToggleText.textContent).toBe("Switch to dark theme");

    drawerToggle.click();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(iconToggle.getAttribute("aria-label")).toBe("Switch to light theme");
    expect(drawerToggle.getAttribute("aria-label")).toBe(
      "Switch to light theme",
    );
    expect(drawerToggleText.textContent).toBe("Switch to light theme");
    expect(document.querySelector("#theme-status")?.textContent).toBe(
      "Dark theme on.",
    );
  });
});
