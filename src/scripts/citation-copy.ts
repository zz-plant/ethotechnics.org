const citationButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-citation-text]"),
);

citationButtons.forEach((button) => {
  const citationText = button.getAttribute("data-citation-text");
  const format = button.getAttribute("data-citation-format") ?? "citation";
  const defaultLabel = button.textContent?.trim() ?? "Copy";

  if (!citationText) {
    return;
  }

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      button.textContent = "Copied";
      button.setAttribute("aria-live", "polite");
      button.setAttribute("aria-label", `${format} copied`);
      window.setTimeout(() => {
        button.textContent = defaultLabel;
        button.setAttribute("aria-label", `Copy ${format}`);
      }, 1600);
    } catch (error) {
      console.error("Unable to copy citation", error);
      button.textContent = "Copy failed";
      window.setTimeout(() => {
        button.textContent = defaultLabel;
      }, 1600);
    }
  });
});
