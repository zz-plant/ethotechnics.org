import { readButtonLabel, setButtonLabel } from "./button-label";

const citationButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-citation-text]"),
);
const copyPopover = document.createElement("div");
copyPopover.className = "copy-popover";
copyPopover.setAttribute("popover", "manual");
copyPopover.setAttribute("role", "status");
document.body?.appendChild(copyPopover);
const POPOVER_VISIBILITY_DURATION = 1600;
let popoverTimer: number | undefined;

const showCopyPopover = (message: string) => {
  copyPopover.textContent = message;
  if (typeof copyPopover.showPopover === "function") {
    copyPopover.showPopover();
    window.clearTimeout(popoverTimer);
    popoverTimer = window.setTimeout(() => {
      copyPopover.hidePopover();
    }, POPOVER_VISIBILITY_DURATION);
  }
};

citationButtons.forEach((button) => {
  const citationText = button.getAttribute("data-citation-text");
  const format = button.getAttribute("data-citation-format") ?? "citation";
  const defaultLabel = readButtonLabel(button) || "Copy";

  if (!citationText) {
    return;
  }

  button.addEventListener("click", () => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(citationText);
        setButtonLabel(button, "Copied");
        button.setAttribute("aria-live", "polite");
        button.setAttribute("aria-label", `${format} copied`);
        showCopyPopover(`${format} copied.`);
        window.setTimeout(() => {
          setButtonLabel(button, defaultLabel);
          // The visible label names the button again once the state clears.
          button.removeAttribute("aria-label");
        }, POPOVER_VISIBILITY_DURATION);
      } catch (error) {
        console.error("Unable to copy citation", error);
        setButtonLabel(button, "Not copied");
        // A blocked clipboard is the browser's call, so the reader gets the
        // way to copy it by hand rather than a bare failure.
        showCopyPopover(
          format === "Permalink"
            ? "Could not copy. Copy the address from your browser's address bar."
            : `Could not copy. Select the ${format} text and copy it by hand.`,
        );
        window.setTimeout(() => {
          setButtonLabel(button, defaultLabel);
        }, POPOVER_VISIBILITY_DURATION);
      }
    })().catch((err) => console.error("Async click handler failed", err));
  });
});
