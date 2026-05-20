import { buildFacetUrl, initFilterInput } from "./filter-utils";

const initGlossaryFilter = () => {
  const filterInput = initFilterInput("#glossary-filter");
  if (!filterInput) return;

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
    document.querySelectorAll<HTMLInputElement>("[data-glossary-filter]"),
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
  const letterButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-glossary-letter]"),
  );
  const tabButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-glossary-tab]"),
  );
  const panels = Array.from(
    document.querySelectorAll<HTMLElement>("[data-glossary-panel]"),
  );
  const activeFilters = document.querySelector<HTMLElement>(
    "[data-glossary-active]",
  );
  const activeFilterChips = activeFilters?.querySelector<HTMLElement>(
    ".glossary-filter__active-chips",
  );
  const entryLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-glossary-entry-link]"),
  );

  if (
    items.length === 0 ||
    !emptyState ||
    !count ||
    !(clearButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  entryLinks.forEach((link) => {
    if (!link.dataset.baseHref) {
      link.dataset.baseHref = link.getAttribute("href") ?? "";
    }
  });

  const total = Number(count.dataset.total) || items.length;

  const facetKeys = ["domains", "phases", "measurability", "status"] as const;
  const QUERY_PARAM_KEY = "query";
  type FacetKey = (typeof facetKeys)[number];
  type FacetSelections = Record<FacetKey, string[]>;

  const syncQueryParam = (
    value: string,
    facets: Partial<Record<FacetKey, string | undefined>>,
  ) => {
    const nextUrl = buildFacetUrl({
      [QUERY_PARAM_KEY]: value || undefined,
      ...facets,
    });
    window.history.replaceState({}, "", nextUrl);

    const search = new URL(nextUrl).search;
    entryLinks.forEach((link) => {
      const baseHref = link.dataset.baseHref ?? link.getAttribute("href") ?? "";
      if (!baseHref) {
        return;
      }
      const url = new URL(baseHref, window.location.origin);
      url.search = search;
      link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    });
  };

  const setActiveTab = (tabId: string) => {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.glossaryTab === tabId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach((panel) => {
      const panelId = panel.dataset.glossaryPanel;
      if (!panelId) {
        return;
      }
      if (panelId === "status") {
        return;
      }
      panel.hidden = panelId !== tabId;
    });
  };

  const getFacetValues = (key: FacetKey) =>
    facetControls
      .filter((control) => control.dataset.glossaryFilter === key)
      .filter((control) => control.checked)
      .map((control) => control.value)
      .filter(Boolean);

  const getFacetLabels = (key: FacetKey) =>
    facetControls
      .filter((control) => control.dataset.glossaryFilter === key)
      .filter((control) => control.checked)
      .map((control) => control.dataset.glossaryLabel ?? control.value)
      .filter(Boolean);

  const indexedItems = items.map((item) => ({
    element: item,
    searchText:
      item.dataset.search?.toLowerCase() ??
      item.textContent?.toLowerCase() ??
      "",
    letter: item.dataset.letter ?? "",
    domains: (item.dataset.domains ?? "").split(" ").filter(Boolean),
    phases: (item.dataset.phases ?? "").split(" ").filter(Boolean),
    measurability: item.dataset.measurability ?? "",
    status: item.dataset.status ?? "",
  }));

  let activeLetter = "all";

  const setActiveLetter = (letter: string) => {
    activeLetter = letter || "all";
    letterButtons.forEach((button) => {
      const buttonLetter = button.dataset.glossaryLetter ?? "all";
      const isActive = buttonLetter === activeLetter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const matchesItem = (
    item: (typeof indexedItems)[number],
    query: string,
    selections: FacetSelections,
  ) => {
    const matchesQuery = item.searchText.includes(query);
    const matchesLetter =
      activeLetter === "all" || item.letter === activeLetter;
    const matchesDomains =
      selections.domains.length === 0 ||
      selections.domains.some((domain) => item.domains.includes(domain));
    const matchesPhases =
      selections.phases.length === 0 ||
      selections.phases.some((phase) => item.phases.includes(phase));
    const matchesMeasurability =
      selections.measurability.length === 0 ||
      selections.measurability.includes(item.measurability);
    const matchesStatus =
      selections.status.length === 0 ||
      selections.status.includes(item.status);

    return (
      matchesQuery &&
      matchesLetter &&
      matchesDomains &&
      matchesPhases &&
      matchesMeasurability &&
      matchesStatus
    );
  };

  const countMatches = (
    query: string,
    selections: FacetSelections,
  ) => indexedItems.filter((item) => matchesItem(item, query, selections)).length;

  const setSectionsOpen = (isOpen: boolean) => {
    chunkedSections.forEach((section) => {
      section.open = isOpen;
    });
  };

  const buildSelections = (): FacetSelections =>
    facetKeys.reduce(
      (acc, key) => ({ ...acc, [key]: getFacetValues(key) }),
      {} as FacetSelections,
    );

  const updateFilter = () => {
    const rawQuery = filterInput.value.trim();
    const query = rawQuery.toLowerCase();
    const selections = buildSelections();
    let visible = 0;

    indexedItems.forEach((item) => {
      const matches = matchesItem(item, query, selections);
      item.element.classList.toggle("is-hidden", !matches);

      if (matches) {
        visible += 1;
      }
    });

    emptyState.hidden = visible > 0;
    const querySuffix = rawQuery ? ` for “${rawQuery}”` : "";
    const letterSuffix = activeLetter !== "all" ? ` · ${activeLetter}` : "";
    const facetLabels = facetKeys.flatMap((key) => getFacetLabels(key));
    const facetSuffix = facetLabels.length
      ? ` · ${facetLabels.join(", ")}`
      : "";
    count.textContent = `Showing ${visible} of ${total} terms${querySuffix}${letterSuffix}${facetSuffix}`;
    const hasFacets = facetControls.some((control) => control.checked);
    const hasLetterFilter = activeLetter !== "all";
    clearButton.disabled =
      rawQuery.length === 0 && !hasFacets && !hasLetterFilter;
    const shouldExpand = rawQuery.length > 0 || hasFacets || hasLetterFilter;
    chunkedSections.forEach((section) => {
      if (shouldExpand) {
        section.open = true;
      } else {
        section.open = section.dataset.defaultOpen === "true";
      }
    });

    facetControls.forEach((control) => {
      const key = control.dataset.glossaryFilter as FacetKey | undefined;
      if (!key) {
        return;
      }
      const currentValues = selections[key];
      const nextValues = control.checked
        ? currentValues
        : [...currentValues, control.value];
      const nextSelections = {
        ...selections,
        [key]: nextValues,
      } as FacetSelections;
      const countValue = countMatches(query, nextSelections);
      const countElement = control
        .closest(".glossary-filter__chip")
        ?.querySelector<HTMLElement>("[data-glossary-count]");
      if (countElement) {
        countElement.textContent = `(${countValue})`;
      }
    });

    if (activeFilters && activeFilterChips) {
      activeFilterChips.innerHTML = "";
      const activeSelections = facetControls
        .filter((control) => control.checked)
        .map((control) => ({
          key: control.dataset.glossaryFilter ?? "",
          value: control.value,
          label: control.dataset.glossaryLabel ?? control.value,
        }))
        .filter((item) => item.key && item.value);

      if (activeLetter !== "all") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "glossary-filter__active-chip";
        button.dataset.glossaryLetterClear = "true";
        button.textContent = `${activeLetter} ×`;
        activeFilterChips.appendChild(button);
      }

      activeSelections.forEach((selection) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "glossary-filter__active-chip";
        button.dataset.glossaryRemove = "true";
        button.dataset.filterKey = selection.key;
        button.dataset.filterValue = selection.value;
        button.textContent = `${selection.label} ×`;
        activeFilterChips.appendChild(button);
      });

      activeFilters.hidden =
        activeSelections.length === 0 && activeLetter === "all";
    }

    const facetParams = facetKeys.reduce(
      (acc, key) => {
        const joinedValue = selections[key].join(",");
        acc[key] = joinedValue || undefined;
        return acc;
      },
      {} as Partial<Record<FacetKey, string | undefined>>,
    );
    syncQueryParam(rawQuery, facetParams);
  };

  const getUrlState = () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get(QUERY_PARAM_KEY)?.trim() ?? "";
    const selections = facetKeys.reduce(
      (acc, key) => {
        const values = params.get(key)?.split(",").filter(Boolean) ?? [];
        acc[key] = values;
        return acc;
      },
      {} as FacetSelections,
    );

    return {
      query,
      selections,
    };
  };

  const initialState = getUrlState();

  if (initialState.query) {
    filterInput.value = initialState.query;
  }

  const applyInitialSelection = (
    key: FacetKey,
    values: string[] | undefined,
  ) => {
    if (!values?.length) {
      return;
    }
    facetControls
      .filter((control) => control.dataset.glossaryFilter === key)
      .forEach((control) => {
        control.checked = values.includes(control.value);
      });
  };

  facetKeys.forEach((key) => {
    applyInitialSelection(key, initialState.selections[key]);
  });

  const initialTab = initialState.selections.domains.length
    ? "domains"
    : initialState.selections.phases.length
      ? "phases"
      : initialState.selections.measurability.length
        ? "measurability"
        : "all";
  setActiveTab(initialTab);

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
  letterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const letter = button.dataset.glossaryLetter ?? "all";
      setActiveLetter(letter);
      scheduleUpdate();
    });
  });
  facetControls.forEach((control) => {
    control.addEventListener("change", scheduleUpdate);
  });
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.glossaryTab ?? "all";
      setActiveTab(tabId);
    });
  });
  activeFilterChips?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest<HTMLButtonElement>(
      "[data-glossary-remove]",
    );
    if (!button) {
      return;
    }
    if (button.dataset.glossaryLetterClear) {
      setActiveLetter("all");
      updateFilter();
      return;
    }
    const key = button.dataset.filterKey;
    const value = button.dataset.filterValue;
    if (!key || !value) {
      return;
    }
    facetControls
      .filter((control) => control.dataset.glossaryFilter === key)
      .forEach((control) => {
        if (control.value === value) {
          control.checked = false;
        }
      });
    updateFilter();
  });
  clearButton.addEventListener("click", () => {
    filterInput.value = "";
    facetControls.forEach((control) => {
      control.checked = false;
    });
    setActiveLetter("all");
    filterInput.focus();
    updateFilter();
  });
  expandAllButton?.addEventListener("click", () => {
    setSectionsOpen(true);
  });
  collapseAllButton?.addEventListener("click", () => {
    setSectionsOpen(false);
  });
  setActiveLetter("all");
  updateFilter();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlossaryFilter);
} else {
  initGlossaryFilter();
}
