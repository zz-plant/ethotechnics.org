const filtersRoot = document.querySelector("[data-diagnostics-filters]");
const grid = document.querySelector("[data-diagnostics-grid]");

if (filtersRoot && grid) {
  const buttons = Array.from(
    filtersRoot.querySelectorAll<HTMLButtonElement>("[data-delivery-filter]"),
  );
  const status = filtersRoot.querySelector<HTMLElement>(
    "[data-delivery-status]",
  );
  const cards = Array.from(
    grid.querySelectorAll<HTMLElement>("[data-delivery]"),
  );

  const setFilter = (filter: string) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.deliveryFilter === filter;
      button.setAttribute("aria-pressed", String(isActive));
      button
        .closest("li")
        ?.classList.toggle("pill-list__item--active", isActive);
    });

    const visibleCards = cards.filter((card) => {
      const delivery = card.dataset.delivery;
      const isVisible = filter === "all" || delivery === filter;
      card.toggleAttribute("hidden", !isVisible);
      return isVisible;
    });

    if (status) {
      status.textContent =
        filter === "all"
          ? "Showing all diagnostics."
          : `Showing ${visibleCards.length} ${filter === "studio" ? "Studio-facilitated" : "self-serve"} diagnostics.`;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setFilter(button.dataset.deliveryFilter ?? "all");
    });
  });

  setFilter("all");
}
