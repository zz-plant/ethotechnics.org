const initSiteSearch = () => {
  const root = document.querySelector<HTMLElement>("[data-site-search]");
  const input = root?.querySelector<HTMLInputElement>(
    "[data-site-search-input]",
  );
  const status = root?.querySelector<HTMLElement>("[data-site-search-status]");
  const rankingNote = root?.querySelector<HTMLElement>(
    "[data-site-search-ranking-note]",
  );
  const contextText = root?.querySelector<HTMLElement>(
    "[data-site-search-context]",
  );
  const emptyState = root?.querySelector<HTMLElement>(
    "[data-site-search-empty]",
  );
  const activeFiltersText = root?.querySelector<HTMLElement>(
    "[data-site-search-active]",
  );
  const clearFiltersButton = root?.querySelector<HTMLButtonElement>(
    "[data-site-search-clear]",
  );
  const clearQueryButton = root?.querySelector<HTMLButtonElement>(
    "[data-site-search-clear-query]",
  );
  const items = Array.from(
    root?.querySelectorAll<HTMLElement>("[data-site-search-item]") ?? [],
  );
  const resultsContainer = root?.querySelector<HTMLElement>(
    ".site-search__results",
  );
  const filterButtons = Array.from(
    root?.querySelectorAll<HTMLButtonElement>("[data-site-search-filter]") ??
      [],
  );

  if (!root || !input || items.length === 0) {
    return;
  }

  const reorderResults = (
    orderedItems: Array<(typeof indexedItems)[number]>,
  ) => {
    if (!resultsContainer) {
      return;
    }

    const fragment = document.createDocumentFragment();
    orderedItems.forEach((item) => {
      fragment.append(item.element);
    });
    resultsContainer.insertBefore(fragment, resultsContainer.firstChild);
  };

  const indexedItems = items.map((item) => ({
    element: item,
    searchText:
      item.dataset.search?.toLowerCase() ??
      item.textContent?.toLowerCase() ??
      "",
    title: item.dataset.title?.toLowerCase() ?? "",
    category: item.dataset.category ?? "",
    tags: item.dataset.tags?.toLowerCase() ?? "",
  }));

  let frame = 0;
  const selectedFilters = new Set<string>();

  const getQueryFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") ?? "";
  };

  const updateUrl = (value: string) => {
    const url = new URL(window.location.href);
    const trimmedValue = value.trim();
    if (trimmedValue) {
      url.searchParams.set("q", trimmedValue);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState(null, "", url.toString());
  };

  const updateClearButtons = () => {
    const hasQuery = input.value.trim().length > 0;
    if (clearQueryButton) {
      clearQueryButton.hidden = !hasQuery;
      clearQueryButton.disabled = !hasQuery;
    }

    if (clearFiltersButton) {
      clearFiltersButton.disabled = selectedFilters.size === 0;
    }
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
    const rawQuery = input.value.trim();
    const query = rawQuery.toLowerCase();
    const hasQuery = query.length > 0;
    let visibleCount = 0;
    const visibleItems: Array<
      (typeof indexedItems)[number] & { score: number }
    > = [];

    indexedItems.forEach((item) => {
      const matchesQuery = !query || item.searchText.includes(query);
      const matchesFilter =
        selectedFilters.size === 0 || selectedFilters.has(item.category);
      const matches = matchesQuery && matchesFilter;
      item.element.toggleAttribute("hidden", !matches);
      if (matches) {
        visibleCount += 1;
        const titleHit = hasQuery && item.title.includes(query) ? 3 : 0;
        const categoryHit =
          hasQuery && item.category.toLowerCase().includes(query) ? 2 : 0;
        const tagsHit = hasQuery && item.tags.includes(query) ? 1 : 0;
        const score = titleHit + categoryHit + tagsHit;
        visibleItems.push({ ...item, score });
      }
      item.element
        .querySelector<HTMLElement>("[data-site-search-top-badge]")
        ?.toggleAttribute("hidden", true);
    });

    if (hasQuery) {
      const rankedItems = visibleItems.sort(
        (a, b) =>
          b.score - a.score ||
          a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
      );

      reorderResults([
        ...rankedItems,
        ...indexedItems.filter((item) => item.element.hasAttribute("hidden")),
      ]);

      rankedItems.forEach((item, index) => {
        const badge = item.element.querySelector<HTMLElement>(
          "[data-site-search-top-badge]",
        );
        if (badge && index < 3 && item.score > 0) {
          badge.toggleAttribute("hidden", false);
          badge.textContent = index === 0 ? "Best match" : "Top match";
        }
      });
    } else {
      reorderResults(indexedItems);
    }

    rankingNote?.toggleAttribute("hidden", !hasQuery);

    if (status) {
      const plural = visibleCount === 1 ? "result" : "results";
      status.textContent = `Showing ${visibleCount} ${plural}.`;
    }

    if (emptyState) {
      emptyState.toggleAttribute("hidden", visibleCount !== 0);
    }

    updateActiveFiltersText();

    if (contextText) {
      const activeQuery = rawQuery.length > 0 ? rawQuery : "none";
      const filterSummary =
        selectedFilters.size > 0
          ? Array.from(selectedFilters)
              .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
              .join(", ")
          : "all collections";
      contextText.textContent = `Active query: ${activeQuery}. Filters: ${filterSummary}.`;
    }

    updateClearButtons();
    updateUrl(rawQuery);
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

  const clearQuery = () => {
    input.value = "";
    input.focus();
    scheduleFilter();
  };

  input.addEventListener("input", scheduleFilter);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && input.value.trim().length > 0) {
      event.preventDefault();
      clearQuery();
    }
  });

  window.addEventListener("popstate", syncFromUrl);
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => toggleFilter(button));
  });
  clearFiltersButton?.addEventListener("click", clearFilters);
  clearQueryButton?.addEventListener("click", clearQuery);

  syncFromUrl();

  if (input.value.trim()) {
    input.focus();
    input.select();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteSearch);
} else {
  initSiteSearch();
}
