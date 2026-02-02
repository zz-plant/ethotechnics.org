const initSiteSearch = () => {
  const root = document.querySelector<HTMLElement>("[data-site-search]");
  const input = root?.querySelector<HTMLInputElement>(
    "[data-site-search-input]",
  );
  const status = root?.querySelector<HTMLElement>("[data-site-search-status]");
  const emptyState = root?.querySelector<HTMLElement>(
    "[data-site-search-empty]",
  );
  const activeFiltersText = root?.querySelector<HTMLElement>(
    "[data-site-search-active]",
  );
  const clearFiltersButton = root?.querySelector<HTMLButtonElement>(
    "[data-site-search-clear]",
  );
  const items = Array.from(
    root?.querySelectorAll<HTMLElement>("[data-site-search-item]") ?? [],
  );
  const filterButtons = Array.from(
    root?.querySelectorAll<HTMLButtonElement>("[data-site-search-filter]") ??
      [],
  );

  if (!root || !input || items.length === 0) {
    return;
  }

  const indexedItems = items.map((item) => ({
    element: item,
    searchText:
      item.dataset.search?.toLowerCase() ??
      item.textContent?.toLowerCase() ??
      "",
    category: item.dataset.category ?? "",
  }));

  let frame = 0;
  const selectedFilters = new Set<string>();

  const getQueryFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") ?? "";
  };

  const updateUrl = (value: string) => {
    const url = new URL(window.location.href);
    if (value.trim()) {
      url.searchParams.set("q", value.trim());
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState(null, "", url.toString());
  };

  const updateActiveFiltersText = () => {
    if (!activeFiltersText) {
      return;
    }

    if (selectedFilters.size === 0) {
      activeFiltersText.textContent = "Viewing all collections.";
      return;
    }

    const filters = Array.from(selectedFilters).sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" }),
    );
    activeFiltersText.textContent = `Filtering to ${filters.join(", ")}.`;
  };

  const applyFilter = () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    indexedItems.forEach((item) => {
      const matchesQuery = !query || item.searchText.includes(query);
      const matchesFilter =
        selectedFilters.size === 0 || selectedFilters.has(item.category);
      const matches = matchesQuery && matchesFilter;
      item.element.toggleAttribute("hidden", !matches);
      if (matches) {
        visibleCount += 1;
      }
    });

    if (status) {
      const plural = visibleCount === 1 ? "result" : "results";
      status.textContent = `Showing ${visibleCount} ${plural}.`;
    }

    if (emptyState) {
      emptyState.toggleAttribute("hidden", visibleCount !== 0);
    }

    updateActiveFiltersText();
    updateUrl(query);
  };

  const scheduleFilter = () => {
    if (frame) {
      return;
    }

    frame = window.requestAnimationFrame(() => {
      frame = 0;
      applyFilter();
    });
  };

  const syncFromUrl = () => {
    const query = getQueryFromUrl();
    input.value = query;
    applyFilter();
  };

  const toggleFilter = (button: HTMLButtonElement) => {
    const value = button.dataset.filterValue;
    if (!value) {
      return;
    }

    if (selectedFilters.has(value)) {
      selectedFilters.delete(value);
      button.setAttribute("aria-pressed", "false");
    } else {
      selectedFilters.add(value);
      button.setAttribute("aria-pressed", "true");
    }

    scheduleFilter();
  };

  const clearFilters = () => {
    selectedFilters.clear();
    filterButtons.forEach((button) =>
      button.setAttribute("aria-pressed", "false"),
    );
    scheduleFilter();
  };

  input.addEventListener("input", scheduleFilter);
  window.addEventListener("popstate", syncFromUrl);
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => toggleFilter(button));
  });
  clearFiltersButton?.addEventListener("click", clearFilters);

  syncFromUrl();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteSearch);
} else {
  initSiteSearch();
}
