const initNavigationExplore = () => {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const exploreToggle = nav.querySelector("[data-explore-toggle]");
  const exploreDialog = nav.querySelector("[data-explore-dialog]");
  const exploreClose = nav.querySelector("[data-explore-close]");
  if (!(exploreDialog instanceof HTMLDialogElement) || !exploreToggle) {
    return;
  }

  let lastFocused: Element | null = null;
  const openDialog = () => {
    lastFocused = document.activeElement;
    exploreDialog.showModal();
    exploreToggle.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      if (exploreClose instanceof HTMLElement) {
        exploreClose.focus();
      }
    });
  };
  const closeDialog = () => {
    if (exploreDialog.open) {
      exploreDialog.close();
    }
  };

  exploreToggle.addEventListener("click", () => {
    if (exploreDialog.open) {
      closeDialog();
      return;
    }
    openDialog();
  });

  if (exploreClose instanceof HTMLElement) {
    exploreClose.addEventListener("click", closeDialog);
  }

  exploreDialog.addEventListener("click", (event) => {
    if (event.target === exploreDialog) {
      closeDialog();
    }
  });

  exploreDialog.addEventListener("close", () => {
    exploreToggle.setAttribute("aria-expanded", "false");
    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavigationExplore);
} else {
  initNavigationExplore();
}
