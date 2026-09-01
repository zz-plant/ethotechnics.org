// `@cloudflare/workers-types` is referenced globally in src/env.d.ts, which
// leaves some lib.dom interfaces (HTMLSelectElement among them) unusable as
// query generics. The controls are only read for their value, so a structural
// type covers what this script needs.
type SelectControl = HTMLElement & { value: string };

const standardsFilter = document.querySelector("[data-standards-filter]");

if (standardsFilter) {
  const laneSelect = standardsFilter.querySelector<SelectControl>(
    "[data-standards-filter-lane]",
  );
  const sortSelect = standardsFilter.querySelector<SelectControl>(
    "[data-standards-filter-sort]",
  );
  const status = standardsFilter.querySelector<HTMLElement>(
    "[data-standards-filter-status]",
  );
  const grid = document.querySelector<HTMLElement>("[data-standards-grid]");
  const emptyState = document.querySelector<HTMLElement>(
    "[data-standards-empty]",
  );
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-standard-card]"),
  );
  const searchParams = new URLSearchParams(window.location.search);

  const initialLane = searchParams.get("lane");
  const initialSort = searchParams.get("sort");

  if (
    laneSelect &&
    initialLane &&
    ["all", "core", "implementation", "reference"].includes(initialLane)
  ) {
    laneSelect.value = initialLane;
  }

  if (
    sortSelect &&
    initialSort &&
    ["citation", "recent", "id"].includes(initialSort)
  ) {
    sortSelect.value = initialSort;
  }

  const sortCards = (activeCards: HTMLElement[], mode: string) => {
    const sortedCards = [...activeCards].sort((a, b) => {
      if (mode === "recent") {
        return (
          Date.parse(b.getAttribute("data-standard-published") ?? "") -
          Date.parse(a.getAttribute("data-standard-published") ?? "")
        );
      }

      if (mode === "id") {
        return (a.getAttribute("data-standard-id") ?? "").localeCompare(
          b.getAttribute("data-standard-id") ?? "",
        );
      }

      const citedDifference =
        Number(b.getAttribute("data-standard-cited") ?? "0") -
        Number(a.getAttribute("data-standard-cited") ?? "0");

      if (citedDifference !== 0) {
        return citedDifference;
      }

      return (a.getAttribute("data-standard-id") ?? "").localeCompare(
        b.getAttribute("data-standard-id") ?? "",
      );
    });

    sortedCards.forEach((card) => {
      grid?.appendChild(card);
    });
  };

  const updateCards = () => {
    const lane = laneSelect?.value ?? "all";
    const sortMode = sortSelect?.value ?? "citation";
    const activeCards = cards.filter((card) => {
      const cardLane = card.getAttribute("data-standard-lane") ?? "reference";
      const isVisible = lane === "all" || cardLane === lane;
      card.hidden = !isVisible;
      return isVisible;
    });

    sortCards(activeCards, sortMode);

    if (emptyState) {
      emptyState.hidden = activeCards.length > 0;
    }

    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set("lane", lane);
    nextParams.set("sort", sortMode);
    const nextQuery = nextParams.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);

    if (status) {
      status.textContent = `Showing ${activeCards.length} standard${
        activeCards.length === 1 ? "" : "s"
      } in ${lane === "all" ? "all lanes" : `${lane} lane`}.`;
    }
  };

  laneSelect?.addEventListener("change", updateCards);
  sortSelect?.addEventListener("change", updateCards);
  updateCards();
}

export {};
