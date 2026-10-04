/**
 * Closes the desktop browse panel the two ways a native <details> will not.
 *
 * The element already handles opening, keyboard focus and the no-script case.
 * What it does not do is behave like a menu: Escape should close it, and so
 * should a click anywhere else on the page. Without those it stays open behind
 * the reader's next click, which is how a dropdown starts feeling broken.
 */

const initializeBrowsePanel = () => {
  const panels = Array.from(
    document.querySelectorAll<HTMLDetailsElement>("[data-nav-browse]"),
  );
  if (panels.length === 0) return;

  const closeAll = (except?: HTMLDetailsElement) => {
    for (const panel of panels) {
      if (panel !== except) panel.open = false;
    }
  };

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = panels.find((panel) => panel.open);
    if (!open) return;
    open.open = false;
    open.querySelector<HTMLElement>("summary")?.focus();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    const inside = panels.find((panel) => panel.contains(target));
    closeAll(inside);
  });

  // A link inside the panel navigates, but on a same-page hash it would
  // otherwise leave the panel hanging open over the destination.
  for (const panel of panels) {
    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("a")) {
        panel.open = false;
      }
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBrowsePanel, {
    once: true,
  });
} else {
  initializeBrowsePanel();
}
