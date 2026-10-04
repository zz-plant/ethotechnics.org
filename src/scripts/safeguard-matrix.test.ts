import { afterEach, describe, expect, it } from "bun:test";
import { initSafeguardMatrix } from "./safeguard-matrix";

describe("safeguard filtering", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("exposes the selected filter and visible result count, then restores all cards", () => {
    document.body.innerHTML = `<div data-safeguard-matrix>
      <button data-matrix-filter="all" aria-pressed="true">All safeguards</button>
      <button data-matrix-filter="standing" aria-pressed="false">Standing</button>
      <p data-matrix-status role="status">2 safeguards shown</p>
      <article data-matrix-card="standing"></article>
      <article data-matrix-card="correction"></article>
    </div>`;
    initSafeguardMatrix(document);
    initSafeguardMatrix(document);
    const buttons = document.querySelectorAll<HTMLButtonElement>("button");
    const cards = document.querySelectorAll<HTMLElement>("article");
    buttons[1]!.click();
    expect(buttons[1]!.getAttribute("aria-pressed")).toBe("true");
    expect(buttons[0]!.getAttribute("aria-pressed")).toBe("false");
    expect(cards[0]!.hidden).toBe(false);
    expect(cards[1]!.hidden).toBe(true);
    expect(document.querySelector("[role=status]")!.textContent).toBe(
      "1 safeguard shown: Standing",
    );
    buttons[0]!.click();
    expect([...cards].every((card) => !card.hidden)).toBe(true);
    expect(document.querySelector("[role=status]")!.textContent).toBe(
      "2 safeguards shown",
    );
  });
});
