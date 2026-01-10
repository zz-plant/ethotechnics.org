const initResearchFilter = () => {
  const filterInput =
    document.querySelector<HTMLInputElement>("#research-filter");
  const items = Array.from(
    document.querySelectorAll<HTMLElement>("[data-research-item]"),
  );
  const emptyState = document.querySelector<HTMLElement>(
    ".research-filter__empty",
  );
  const count = document.querySelector<HTMLElement>(".research-filter__count");
  const clearButton = document.querySelector<HTMLButtonElement>(
    "[data-clear-research-filter]",
  );
  const facetControls = Array.from(
    document.querySelectorAll<HTMLSelectElement>("[data-research-filter]"),
  );
  const chunkedSections = Array.from(
    document.querySelectorAll<HTMLDetailsElement>(".chunked-section"),
  );

  if (
    !(filterInput instanceof HTMLInputElement) ||
    items.length === 0 ||
    !emptyState ||
    !count ||
    !(clearButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  const total = Number(count.dataset.total) || items.length;

  const syncQueryParam = (
    value: string,
    facets: Record<string, string | undefined>,
  ) => {
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    Object.entries(facets).forEach(([key, facetValue]) => {
      if (facetValue) {
        params.set(key, facetValue);
      } else {
        params.delete(key);
      }
    });

    const search = params.toString();
    const nextUrl = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;

    window.history.replaceState({}, "", nextUrl);
  };

  const getFacetValue = (key: string) =>
    facetControls.find((control) => control.dataset.researchFilter === key)
      ?.value ?? "";

  const getFacetLabel = (key: string) => {
    const control = facetControls.find(
      (item) => item.dataset.researchFilter === key,
    );
    if (!control?.value) {
      return "";
    }

    return control.selectedOptions[0]?.textContent?.trim() ?? control.value;
  };

  const indexedItems = items.map((item) => ({
    element: item,
    searchText:
      item.dataset.search?.toLowerCase() ??
      item.textContent?.toLowerCase() ??
      "",
    section: item.dataset.section ?? "",
    tags: (item.dataset.tags ?? "").split(" ").filter(Boolean),
  }));

  const updateFilter = () => {
    const rawQuery = filterInput.value.trim();
    const query = rawQuery.toLowerCase();
    const activeSection = getFacetValue("section");
    const activeTag = getFacetValue("tag");
    let visible = 0;

    indexedItems.forEach((item) => {
      const matchesQuery = item.searchText.includes(query);
      const matchesSection = !activeSection || item.section === activeSection;
      const matchesTag = !activeTag || item.tags.includes(activeTag);
      const matches = matchesQuery && matchesSection && matchesTag;
      item.element.classList.toggle("is-hidden", !matches);

      if (matches) {
        visible += 1;
      }
    });

    emptyState.hidden = visible > 0;
    const querySuffix = rawQuery ? ` for “${rawQuery}”` : "";
    const facetLabels = [getFacetLabel("section"), getFacetLabel("tag")].filter(
      Boolean,
    );
    const facetSuffix = facetLabels.length
      ? ` · ${facetLabels.join(", ")}`
      : "";
    count.textContent = `Showing ${visible} of ${total} entries${querySuffix}${facetSuffix}`;
    const hasFacets = facetControls.some((control) => control.value);
    clearButton.disabled = rawQuery.length === 0 && !hasFacets;
    const shouldExpand = rawQuery.length > 0 || hasFacets;
    chunkedSections.forEach((section) => {
      if (shouldExpand) {
        section.open = true;
      } else {
        section.open = section.dataset.defaultOpen === "true";
      }
    });
    syncQueryParam(rawQuery, {
      section: activeSection,
      tag: activeTag,
    });
  };

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("query")?.trim();
  const initialSection = params.get("section")?.trim();
  const initialTag = params.get("tag")?.trim();

  if (initialQuery) {
    filterInput.value = initialQuery;
  }
  if (initialSection) {
    const control = facetControls.find(
      (item) => item.dataset.researchFilter === "section",
    );
    if (control) {
      control.value = initialSection;
    }
  }
  if (initialTag) {
    const control = facetControls.find(
      (item) => item.dataset.researchFilter === "tag",
    );
    if (control) {
      control.value = initialTag;
    }
  }

  let animationFrame: number | null = null;
  const scheduleUpdate = () => {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
    }
    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = null;
      updateFilter();
    });
  };

  filterInput.addEventListener("input", scheduleUpdate);
  filterInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && filterInput.value) {
      event.preventDefault();
      filterInput.value = "";
      updateFilter();
    }
  });
  facetControls.forEach((control) => {
    control.addEventListener("change", scheduleUpdate);
  });
  clearButton.addEventListener("click", () => {
    filterInput.value = "";
    facetControls.forEach((control) => {
      control.value = "";
    });
    filterInput.focus();
    updateFilter();
  });
  updateFilter();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initResearchFilter);
} else {
  initResearchFilter();
}
