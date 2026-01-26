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
    !(filterInput instanceof HTMLInputElement) ||
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

  const getFacetValues = (key: string) =>
    facetControls
      .filter((control) => control.dataset.glossaryFilter === key)
      .filter((control) => control.checked)
      .map((control) => control.value)
      .filter(Boolean);

  const getFacetLabels = (key: string) =>
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
    selections: {
      domains: string[];
      phases: string[];
      measurability: string[];
      status: string[];
    },
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
    selections: {
      domains: string[];
      phases: string[];
      measurability: string[];
      status: string[];
    },
  ) => indexedItems.filter((item) => matchesItem(item, query, selections)).length;

  const setSectionsOpen = (isOpen: boolean) => {
    chunkedSections.forEach((section) => {
      section.open = isOpen;
    });
  };

  const updateFilter = () => {
    const rawQuery = filterInput.value.trim();
    const query = rawQuery.toLowerCase();
    const selections = {
      domains: getFacetValues("domains"),
      phases: getFacetValues("phases"),
      measurability: getFacetValues("measurability"),
      status: getFacetValues("status"),
    };
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
    const letterSuffix =
      activeLetter !== "all" ? ` · ${activeLetter}` : "";
    const facetLabels = [
      ...getFacetLabels("domains"),
      ...getFacetLabels("phases"),
      ...getFacetLabels("measurability"),
      ...getFacetLabels("status"),
    ];
    const facetSuffix = facetLabels.length
      ? ` · ${facetLabels.join(", ")}`
      : "";
    count.textContent = `Showing ${visible} of ${total} terms${querySuffix}${letterSuffix}${facetSuffix}`;
    const hasFacets = facetControls.some((control) => control.checked);
    const hasLetterFilter = activeLetter !== "all";
    clearButton.disabled =
      rawQuery.length === 0 && !hasFacets && !hasLetterFilter;
    const shouldExpand =
      rawQuery.length > 0 || hasFacets || hasLetterFilter;
    chunkedSections.forEach((section) => {
      if (shouldExpand) {
        section.open = true;
      } else {
        section.open = section.dataset.defaultOpen === "true";
      }
    });

    facetControls.forEach((control) => {
      const key = control.dataset.glossaryFilter ?? "";
      const currentValues = selections[key as keyof typeof selections] ?? [];
      const nextValues = control.checked
        ? currentValues
        : [...currentValues, control.value];
      const nextSelections = {
        ...selections,
        [key]: nextValues,
      } as typeof selections;
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

    const domainParam = selections.domains.join(",");
    const phaseParam = selections.phases.join(",");
    const measurabilityParam = selections.measurability.join(",");
    const statusParam = selections.status.join(",");
    syncQueryParam(rawQuery, {
      domains: domainParam || undefined,
      phases: phaseParam || undefined,
      measurability: measurabilityParam || undefined,
      status: statusParam || undefined,
    });
  };

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("query")?.trim();
  const initialDomains = params.get("domains")?.split(",").filter(Boolean);
  const initialPhases = params.get("phases")?.split(",").filter(Boolean);
  const initialMeasurability = params
    .get("measurability")
    ?.split(",")
    .filter(Boolean);
  const initialStatus = params.get("status")?.split(",").filter(Boolean);

  if (initialQuery) {
    filterInput.value = initialQuery;
  }

  const applyInitialSelection = (key: string, values: string[] | undefined) => {
    if (!values?.length) {
      return;
    }
    facetControls
      .filter((control) => control.dataset.glossaryFilter === key)
      .forEach((control) => {
        control.checked = values.includes(control.value);
      });
  };

  applyInitialSelection("domains", initialDomains);
  applyInitialSelection("phases", initialPhases);
  applyInitialSelection("measurability", initialMeasurability);
  applyInitialSelection("status", initialStatus);

  let initialTab = "all";
  if (initialDomains?.length) {
    initialTab = "domains";
  } else if (initialPhases?.length) {
    initialTab = "phases";
  } else if (initialMeasurability?.length) {
    initialTab = "measurability";
  }
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
