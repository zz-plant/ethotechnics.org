const initGlossaryFilter = () => {
  const filterInput =
    document.querySelector<HTMLInputElement>("#glossary-filter");
  const items = Array.from(
    document.querySelectorAll<HTMLElement>(".glossary-index__item"),
  );
  const emptyState = document.querySelector<HTMLElement>(
    ".glossary-index__empty",
  );
  const count = document.querySelector<HTMLElement>(".glossary-filter__count");
  const clearButton = document.querySelector<HTMLButtonElement>(
    "[data-clear-filter]",
  );
  const facetControls = Array.from(
    document.querySelectorAll<HTMLSelectElement>("[data-glossary-filter]"),
  );
  const chunkedSections = Array.from(
    document.querySelectorAll<HTMLDetailsElement>(".chunked-section"),
  );
  const expandAllButton = document.querySelector<HTMLButtonElement>(
    "[data-glossary-expand]",
  );
  const collapseAllButton = document.querySelector<HTMLButtonElement>(
    "[data-glossary-collapse]",
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
    facetControls.find((control) => control.dataset.glossaryFilter === key)
      ?.value ?? "";

  const getFacetLabel = (key: string) => {
    const control = facetControls.find(
      (item) => item.dataset.glossaryFilter === key,
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
    categoryId: item.dataset.categoryId ?? "",
    tags: (item.dataset.tags ?? "").split(" ").filter(Boolean),
    status: item.dataset.status ?? "",
  }));

  const setSectionsOpen = (isOpen: boolean) => {
    chunkedSections.forEach((section) => {
      section.open = isOpen;
    });
  };

  const updateFilter = () => {
    const rawQuery = filterInput.value.trim();
    const query = rawQuery.toLowerCase();
    const activeCategory = getFacetValue("category");
    const activeTag = getFacetValue("tag");
    const activeStatus = getFacetValue("status");
    let visible = 0;

    indexedItems.forEach((item) => {
      const matchesQuery = item.searchText.includes(query);
      const matchesCategory =
        !activeCategory || item.categoryId === activeCategory;
      const matchesTag = !activeTag || item.tags.includes(activeTag);
      const matchesStatus = !activeStatus || item.status === activeStatus;
      const matches =
        matchesQuery && matchesCategory && matchesTag && matchesStatus;
      item.element.classList.toggle("is-hidden", !matches);

      if (matches) {
        visible += 1;
      }
    });

    emptyState.hidden = visible > 0;
    const querySuffix = rawQuery ? ` for “${rawQuery}”` : "";
    const facetLabels = [
      getFacetLabel("category"),
      getFacetLabel("tag"),
      getFacetLabel("status"),
    ].filter(Boolean);
    const facetSuffix = facetLabels.length
      ? ` · ${facetLabels.join(", ")}`
      : "";
    count.textContent = `Showing ${visible} of ${total} terms${querySuffix}${facetSuffix}`;
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
      category: activeCategory,
      tag: activeTag,
      status: activeStatus,
    });
  };

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("query")?.trim();
  const initialCategory = params.get("category")?.trim();
  const initialTag = params.get("tag")?.trim();
  const initialStatus = params.get("status")?.trim();

  if (initialQuery) {
    filterInput.value = initialQuery;
  }
  if (initialCategory) {
    const control = facetControls.find(
      (item) => item.dataset.glossaryFilter === "category",
    );
    if (control) {
      control.value = initialCategory;
    }
  }
  if (initialTag) {
    const control = facetControls.find(
      (item) => item.dataset.glossaryFilter === "tag",
    );
    if (control) {
      control.value = initialTag;
    }
  }
  if (initialStatus) {
    const control = facetControls.find(
      (item) => item.dataset.glossaryFilter === "status",
    );
    if (control) {
      control.value = initialStatus;
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
  expandAllButton?.addEventListener("click", () => {
    setSectionsOpen(true);
  });
  collapseAllButton?.addEventListener("click", () => {
    setSectionsOpen(false);
  });
  updateFilter();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlossaryFilter);
} else {
  initGlossaryFilter();
}
