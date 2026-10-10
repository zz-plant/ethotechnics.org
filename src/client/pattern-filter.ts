import { buildFacetUrl, parseFacetParams } from "./filter-utils";

// The catalog filter does two things: narrow the cards by safeguard and by
// search text, and keep both in the URL so a filtered view can be linked.
// Everything else a reader needs is on the mechanism's own page.
const initializePatternFilter = (root: HTMLElement) => {
  const filters = (root.getAttribute("data-filters") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const filterLabels = JSON.parse(
    root.getAttribute("data-filter-labels") ?? "{}",
  ) as Record<string, string>;
  const filterButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-filter]"),
  );
  const searchInput = root.querySelector<HTMLInputElement>(
    "[data-search-input]",
  );
  const emptyState = root.querySelector<HTMLElement>("[data-empty]");
  const status = root.querySelector<HTMLElement>("[data-filter-status]");
  const cardMetadata = Array.from(
    root.querySelectorAll<HTMLElement>("[data-pattern-card]"),
  ).map((card) => ({
    card,
    normalizedFilters: (card.getAttribute("data-filters") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    normalizedSearch: (card.getAttribute("data-search") ?? "").toLowerCase(),
  }));

  let selectedFilter: string | null = null;
  let query = "";

  const getFilterLabel = (filter: string) => filterLabels[filter] ?? filter;

  const getUrlState = () => {
    const { filter, q } = parseFacetParams(["filter", "q"]);
    return {
      filter: filter && filters.includes(filter) ? filter : null,
      query: q ?? "",
    };
  };

  const updateUrlState = () => {
    const url = buildFacetUrl({
      filter: selectedFilter ?? undefined,
      q: query.trim() || undefined,
    });
    window.history.replaceState(null, "", url);
  };

  const updateFilterButtons = () => {
    filterButtons.forEach((button) => {
      const filter = button.getAttribute("data-filter");
      const isActive =
        (!selectedFilter && filter === "all") || selectedFilter === filter;
      const parent = button.closest(".pill-list__item");

      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      parent?.classList.toggle("pill-list__item--active", isActive);
    });
  };

  const applyFilters = () => {
    const normalizedQuery = query.trim().toLowerCase();
    let visibleCount = 0;

    cardMetadata.forEach(({ card, normalizedFilters, normalizedSearch }) => {
      const matchesFilter =
        !selectedFilter || normalizedFilters.includes(selectedFilter);
      const matchesQuery =
        !normalizedQuery || normalizedSearch.includes(normalizedQuery);
      const isVisible = matchesFilter && matchesQuery;

      card.toggleAttribute("hidden", !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.toggleAttribute("hidden", visibleCount !== 0);
    }

    if (status) {
      const filterLabel = selectedFilter
        ? getFilterLabel(selectedFilter)
        : "All safeguards";
      const queryLabel = normalizedQuery
        ? ` and search for "${normalizedQuery}"`
        : "";
      const pluralized = visibleCount === 1 ? "mechanism" : "mechanisms";
      status.textContent = `${visibleCount} ${pluralized} visible with ${filterLabel}${queryLabel}.`;
    }
  };

  let filterFrame = 0;

  const scheduleFilterApplication = () => {
    if (filterFrame) {
      return;
    }

    filterFrame = window.requestAnimationFrame(() => {
      applyFilters();
      filterFrame = 0;
    });
  };

  const handleFilterChange = (filter: string) => {
    if (filter === "all") {
      selectedFilter = null;
    } else {
      selectedFilter = selectedFilter === filter ? null : filter;
    }

    updateUrlState();
    updateFilterButtons();
    scheduleFilterApplication();
  };

  const readUrlState = () => {
    const urlState = getUrlState();
    selectedFilter = urlState.filter;
    query = urlState.query;
    if (searchInput) {
      searchInput.value = query;
    }
    updateFilterButtons();
  };

  const initialize = () => {
    readUrlState();
    applyFilters();
    updateUrlState();

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        if (!filter) {
          return;
        }

        handleFilterChange(filter);
      });
    });

    searchInput?.addEventListener("input", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      query = target.value;
      updateUrlState();
      scheduleFilterApplication();
    });

    window.addEventListener("popstate", () => {
      readUrlState();
      scheduleFilterApplication();
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        initialize();
        observer.disconnect();
      }
    });

    observer.observe(root);
  } else {
    initialize();
  }
};

const initPatternFilters = () => {
  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-pattern-filter]"),
  );

  roots.forEach(initializePatternFilter);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPatternFilters);
} else {
  initPatternFilters();
}
