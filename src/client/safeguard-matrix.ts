export function initSafeguardMatrix(root: ParentNode = document) {
  root
    .querySelectorAll<HTMLElement>("[data-safeguard-matrix]")
    .forEach((container) => {
      if (container.dataset.matrixReady) return;
      container.dataset.matrixReady = "true";
      const filters = container.querySelectorAll<HTMLButtonElement>(
        "[data-matrix-filter]",
      );
      const cards =
        container.querySelectorAll<HTMLElement>("[data-matrix-card]");
      const status = container.querySelector<HTMLElement>(
        "[data-matrix-status]",
      );
      filters.forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.dataset.matrixFilter;
          filters.forEach((control) => {
            const selected = control === button;
            control.classList.toggle("matrix-tab--active", selected);
            control.setAttribute("aria-pressed", String(selected));
          });
          let visible = 0;
          cards.forEach((card) => {
            card.hidden =
              filter !== "all" && card.dataset.matrixCard !== filter;
            if (!card.hidden) visible += 1;
          });
          if (status) {
            status.textContent =
              filter === "all"
                ? `${visible} safeguards shown`
                : `${visible} safeguard shown: ${button.textContent?.trim()}`;
          }
        });
      });
    });
}
