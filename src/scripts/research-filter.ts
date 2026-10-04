import {
  buildFacetUrl,
  initFilterInput,
  parseFacetParams,
} from "./filter-utils";

const initResearchFilter = () => {
  const filterInput = initFilterInput("#research-filter");
  if (!filterInput) return;

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
    document.querySelectorAll("select[data-research-filter]"),
  ).reduce<HTMLSelectElement[]>((acc, control) => {
    if (control instanceof HTMLSelectElement) {
      acc.push(control);
    }
    return acc;
  }, []);
  const chunkedSections = Array.from(
    document.querySelectorAll<HTMLDetailsElement>(".chunked-section"),
  );
  const expandAllButton = document.querySelector<HTMLButtonElement>(
    "[data-research-expand]",
  );
  const collapseAllButton = document.querySelector<HTMLButtonElement>(
    "[data-research-collapse]",
  );

  if (
    items.length === 0 ||
    !emptyState ||
    !count ||
    !(clearButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  const total = Number(count.dataset.total) || items.length;

  const getFacetValue = (key: string) =>
    facetControls.find((control) => control.dataset.researchFilter === key)
      ?.value ?? "";

  const getFacetLabel = (key: string) => {
    const control = facetControls.find(
      (item) => item.dataset.researchFilter === key,
    );
    if (!control?.value) return "";
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
    type: item.dataset.type ?? "",
  }));

  const setSectionsOpen = (isOpen: boolean) => {
    chunkedSections.forEach((section) => {
      section.open = isOpen;
    });
  };

  const updateFilter = () => {
    const rawQuery = filterInput.value.trim();
    const query = rawQuery.toLowerCase();
    const activeSection = getFacetValue("section");
    const activeTag = getFacetValue("tag");
    const activeType = getFacetValue("type");
    let visible = 0;

    indexedItems.forEach((item) => {
      const matches =
        item.searchText.includes(query) &&
        (!activeSection || item.section === activeSection) &&
        (!activeTag || item.tags.includes(activeTag)) &&
        (!activeType || item.type === activeType);
      item.element.classList.toggle("is-hidden", !matches);
      if (matches) visible += 1;
    });

    emptyState.hidden = visible > 0;
    const querySuffix = rawQuery ? ` for \u201c${rawQuery}\u201d` : "";
    const facetLabels = [
      getFacetLabel("section"),
      getFacetLabel("tag"),
      getFacetLabel("type"),
    ].filter(Boolean);
    const facetSuffix = facetLabels.length
      ? ` \u00b7 ${facetLabels.join(", ")}`
      : "";
    count.textContent = `Showing ${visible} of ${total} entries${querySuffix}${facetSuffix}`;
    const hasFacets = facetControls.some((control) => !!control.value);
    clearButton.disabled = rawQuery.length === 0 && !hasFacets;
    const shouldExpand = rawQuery.length > 0 || hasFacets;
    chunkedSections.forEach((section) => {
      section.open = shouldExpand
        ? true
        : section.dataset.defaultOpen === "true";
    });

    const nextUrl = buildFacetUrl({
      query: rawQuery || undefined,
      section: activeSection || undefined,
      tag: activeTag || undefined,
      type: activeType || undefined,
    });
    window.history.replaceState({}, "", nextUrl);
  };

  const urlState = parseFacetParams(["query", "section", "tag", "type"]);
  if (urlState.query) filterInput.value = urlState.query;
  if (urlState.section) {
    const control = facetControls.find(
      (c) => c.dataset.researchFilter === "section",
    );
    if (control) control.value = urlState.section;
  }
  if (urlState.tag) {
    const control = facetControls.find(
      (c) => c.dataset.researchFilter === "tag",
    );
    if (control) control.value = urlState.tag;
  }
  if (urlState.type) {
    const control = facetControls.find(
      (c) => c.dataset.researchFilter === "type",
    );
    if (control) control.value = urlState.type;
  }

  let animationFrame: number | null = null;
  const scheduleUpdate = () => {
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
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
  expandAllButton?.addEventListener("click", () => setSectionsOpen(true));
  collapseAllButton?.addEventListener("click", () => setSectionsOpen(false));
  updateFilter();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initResearchFilter);
} else {
  initResearchFilter();
}
