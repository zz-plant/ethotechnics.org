/**
 * A button with an icon keeps its words in a [data-button-label] span, so a
 * script that swaps "Copy" for "Copied" leaves the icon in place. A button
 * without the span is relabelled whole.
 */
const labelOf = (button: Element): Element =>
  button.querySelector("[data-button-label]") ?? button;

export const readButtonLabel = (button: Element): string =>
  labelOf(button).textContent?.trim() ?? "";

export const setButtonLabel = (button: Element, text: string): void => {
  labelOf(button).textContent = text;
};
