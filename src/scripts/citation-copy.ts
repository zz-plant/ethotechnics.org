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
  const defaultLabel = button.textContent?.trim() ?? "Copy";

  if (!citationText) {
    return;
  }

  button.addEventListener("click", () => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(citationText);
        button.textContent = "Copied";
        button.setAttribute("aria-live", "polite");
        button.setAttribute("aria-label", `${format} copied`);
        showCopyPopover(`${format} copied.`);
        window.setTimeout(() => {
          button.textContent = defaultLabel;
          button.setAttribute("aria-label", `Copy ${format}`);
        }, POPOVER_VISIBILITY_DURATION);
      } catch (error) {
        console.error("Unable to copy citation", error);
        button.textContent = "Copy failed";
        showCopyPopover("Copy failed.");
        window.setTimeout(() => {
          button.textContent = defaultLabel;
        }, POPOVER_VISIBILITY_DURATION);
      }
    })().catch((err) => console.error("Async click handler failed", err));
  });
});
