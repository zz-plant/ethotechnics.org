import { describe, expect, it } from "bun:test";

import { readButtonLabel, setButtonLabel } from "./button-label";

const button = (html: string) => {
  const element = document.createElement("button");
  element.innerHTML = html;
  return element;
};

describe("button labels", () => {
  it("relabels the label span and keeps the icon", () => {
    const element = button(
      '<svg class="action-icon"></svg><span data-button-label>Copy link</span>',
    );
    expect(readButtonLabel(element)).toBe("Copy link");
    setButtonLabel(element, "Copied");
    expect(readButtonLabel(element)).toBe("Copied");
    expect(element.querySelector("svg")).not.toBeNull();
  });

  it("relabels a button without a label span whole", () => {
    const element = button(" Copy ");
    expect(readButtonLabel(element)).toBe("Copy");
    setButtonLabel(element, "Copied");
    expect(element.textContent).toBe("Copied");
  });
});
