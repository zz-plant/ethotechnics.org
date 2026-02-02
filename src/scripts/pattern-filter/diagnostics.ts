export const createDiagnosticCopyText = (card: HTMLElement) => {
  const links = Array.from(
    card.querySelectorAll<HTMLAnchorElement>("[data-diagnostic-link]"),
  );

  return links
    .map((link) => {
      const label = link.textContent?.trim() ?? "";
      const href = link.getAttribute("href") ?? "";
      if (!href) {
        return label;
      }
      const absolute = new URL(href, window.location.origin).toString();
      return label ? `${label} — ${absolute}` : absolute;
    })
    .filter(Boolean)
    .join("\n");
};
