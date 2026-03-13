import { composePatternBundle } from "./pattern-filter/bundle";
import { createDiagnosticCopyText } from "./pattern-filter/diagnostics";
import {
  loadFilterState,
  loadSelection,
  saveFilterState,
  saveSelection,
} from "./pattern-filter/storage";
import type { PatternBundleEntry } from "./pattern-filter/types";

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
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>("[data-pattern-card]"),
  );
  const selectionInputs = Array.from(
    root.querySelectorAll<HTMLInputElement>("[data-pattern-select]"),
  );
  const bundleLink =
    root.querySelector<HTMLAnchorElement>("[data-bundle-link]");
  const bundleStatus = root.querySelector<HTMLElement>(
    "[data-selection-status]",
  );
  const downloadButton = root.querySelector<HTMLButtonElement>(
    "[data-download-bundle]",
  );
  const printButton = root.querySelector<HTMLButtonElement>(
    "[data-print-bundle]",
  );
  const copyBundleButton =
    root.querySelector<HTMLButtonElement>("[data-copy-bundle]");
  const emailForm = root.querySelector<HTMLFormElement>("[data-email-form]");
  const emailInput = root.querySelector<HTMLInputElement>(
    "[data-bundle-email]",
  );
  const emailSubmit = root.querySelector<HTMLButtonElement>(
    "[data-email-submit]",
  );
  const emailStatus = root.querySelector<HTMLElement>("[data-email-status]");
  const emptyState = root.querySelector<HTMLElement>("[data-empty]");
  const status = root.querySelector<HTMLElement>("[data-filter-status]");
  const saveFiltersButton = root.querySelector<HTMLButtonElement>(
    "[data-save-filters]",
  );
  const restoreFiltersButton = root.querySelector<HTMLButtonElement>(
    "[data-restore-filters]",
  );
  const clearFiltersButton = root.querySelector<HTMLButtonElement>(
    "[data-clear-filters]",
  );
  const savedStatus = root.querySelector<HTMLElement>("[data-saved-status]");
  const patternPayloads = new Map<string, PatternBundleEntry>();
  const cardsBySlug = new Map<string, HTMLElement>();
  const cardMetadata = cards.map((card) => {
    const slug = card.id;
    const normalizedFilters = (card.getAttribute("data-filters") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const normalizedSearch = (
      card.getAttribute("data-search") ?? ""
    ).toLowerCase();

    if (slug) {
      cardsBySlug.set(slug, card);
    }

    return { card, normalizedFilters, normalizedSearch };
  });

  let selectedFilter: string | null = null;
  let query = "";
  const selection = new Set<string>();
  const defaultEmailStatus = emailStatus?.textContent ?? "";

  const getFilterLabel = (filter: string) => filterLabels[filter] ?? filter;

  const setSelection = (slugs: string[]) => {
    selection.clear();
    slugs.forEach((slug) => selection.add(slug));
    selectionInputs.forEach((input) => {
      input.checked = selection.has(input.value);
    });
  };

  const getBundleLink = () => {
    const url = new URL(window.location.href);

    if (selection.size) {
      url.searchParams.set("bundle", Array.from(selection).join(","));
    } else {
      url.searchParams.delete("bundle");
    }

    url.hash = "mechanisms";

    return url.toString();
  };

  const updateBundleControls = () => {
    const count = selection.size;
    const hasSelection = count > 0;

    [downloadButton, printButton, copyBundleButton, emailSubmit].forEach(
      (button) => {
        if (!button) return;
        button.setAttribute("aria-disabled", hasSelection ? "false" : "true");
        button.classList.toggle("is-disabled", !hasSelection);
      },
    );

    if (bundleStatus) {
      const pluralized = count === 1 ? "mechanism" : "mechanisms";
      bundleStatus.textContent = hasSelection
        ? `${count} ${pluralized} saved for your bundle.`
        : "No mechanisms selected yet.";
    }

    if (emailStatus && emailStatus.textContent !== defaultEmailStatus) {
      emailStatus.textContent = defaultEmailStatus;
    }

    if (bundleLink) {
      bundleLink.href = getBundleLink();
    }
  };

  const triggerDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const openPrintView = (content: string) => {
    const printWindow = window.open("", "_blank", "noopener");

    if (!printWindow) {
      return;
    }

    printWindow.document.title = "Mechanism bundle";

    const pre = printWindow.document.createElement("pre");
    pre.textContent = content;
    pre.style.whiteSpace = "pre-wrap";
    pre.style.fontFamily =
      "ui-monospace, Menlo, 'SFMono-Regular', Consolas, 'Liberation Mono', monospace";
    pre.style.padding = "1.4rem";

    printWindow.document.body.innerHTML = "";
    printWindow.document.body.appendChild(pre);
    printWindow.focus();
    printWindow.print();
  };

  const getPatternPayload = (slug: string) => {
    const cachedPayload = patternPayloads.get(slug);
    if (cachedPayload) {
      return cachedPayload;
    }

    const card = cardsBySlug.get(slug);
    const encodedPayload = card?.getAttribute("data-pattern-payload") ?? "";

    if (!encodedPayload) {
      return null;
    }

    try {
      const parsed = JSON.parse(
        decodeURIComponent(encodedPayload),
      ) as PatternBundleEntry;
      patternPayloads.set(parsed.slug, parsed);
      return parsed;
    } catch (error) {
      console.error("Unable to parse pattern payload", error);
      return null;
    }
  };

  const getSelectedPayloads = () =>
    Array.from(selection)
      .map((slug) => getPatternPayload(slug))
      .filter((entry): entry is PatternBundleEntry => Boolean(entry));

  const announceSelectionRequired = (
    message: string,
    target?: HTMLElement | null,
  ) => {
    if (target) {
      target.textContent = message;
    }

    if (bundleStatus && target !== bundleStatus) {
      bundleStatus.textContent = message;
    }

    selectionInputs[0]?.focus();
  };

  const getUrlState = () => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    const queryParam = params.get("q") ?? "";

    return {
      filter: filter && filters.includes(filter) ? filter : null,
      query: queryParam,
    };
  };

  const updateUrlState = () => {
    const url = new URL(window.location.href);

    if (selectedFilter) {
      url.searchParams.set("filter", selectedFilter);
    } else {
      url.searchParams.delete("filter");
    }

    if (query.trim()) {
      url.searchParams.set("q", query.trim());
    } else {
      url.searchParams.delete("q");
    }

    window.history.replaceState(null, "", url.toString());
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
        : "All themes";
      const queryLabel = normalizedQuery
        ? ` and search for "${normalizedQuery}"`
        : "";
      const pluralized = visibleCount === 1 ? "mechanism" : "mechanisms";
      status.textContent = `${visibleCount} ${pluralized} visible with ${filterLabel}${queryLabel}.`;
    }
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

  const applySavedStatus = (message: string) => {
    if (!savedStatus) {
      return;
    }

    savedStatus.textContent = message;
  };

  const saveFilters = () => {
    saveFilterState({ filter: selectedFilter, query });
    applySavedStatus("Saved current filters to this device.");
  };

  const restoreFilters = () => {
    const saved = loadFilterState(filters);

    if (!saved) {
      applySavedStatus("No saved filters found yet.");
      return;
    }

    selectedFilter = saved.filter;
    query = saved.query;
    if (searchInput) {
      searchInput.value = query;
    }
    updateUrlState();
    updateFilterButtons();
    scheduleFilterApplication();
    applySavedStatus("Restored your saved filters.");
  };

  const clearFilters = () => {
    selectedFilter = null;
    query = "";
    if (searchInput) {
      searchInput.value = "";
    }
    updateUrlState();
    updateFilterButtons();
    scheduleFilterApplication();
    applySavedStatus("Cleared filters and search.");
  };

  const handlePopState = () => {
    const urlState = getUrlState();
    selectedFilter = urlState.filter;
    query = urlState.query;
    if (searchInput) {
      searchInput.value = query;
    }
    updateFilterButtons();
    scheduleFilterApplication();
  };

  const initialize = () => {
    const urlState = getUrlState();
    selectedFilter = urlState.filter;
    query = urlState.query;
    if (searchInput) {
      searchInput.value = query;
    }
    updateFilterButtons();
    applyFilters();

    const savedSelection = loadSelection();
    const searchParams = new URLSearchParams(window.location.search);
    const bundleParam = searchParams.get("bundle");
    const paramSelection = bundleParam
      ? bundleParam
          .split(",")
          .map((slug) => slug.trim())
          .filter(Boolean)
      : [];

    const combinedSelection = Array.from(
      new Set([...savedSelection, ...paramSelection]),
    );

    if (combinedSelection.length) {
      setSelection(combinedSelection);
    }

    updateBundleControls();
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

    cards.forEach((card) => {
      const copyButton = card.querySelector<HTMLButtonElement>(
        "[data-copy-diagnostics]",
      );
      const status = card.querySelector<HTMLElement>(
        "[data-diagnostic-status]",
      );

      if (!copyButton) {
        return;
      }

      const defaultLabel =
        copyButton.textContent?.trim() ?? "Copy diagnostic links";

      copyButton.addEventListener("click", () => {
        const diagnostics = createDiagnosticCopyText(card);

        if (!diagnostics) {
          if (status) {
            status.textContent = "No diagnostics listed for this mechanism.";
          }
          return;
        }

        void (async () => {
          try {
            await navigator.clipboard.writeText(diagnostics);
            copyButton.textContent = "Copied";
            if (status) {
              status.textContent = "Diagnostic links copied.";
            }
            window.setTimeout(() => {
              copyButton.textContent = defaultLabel;
            }, 1400);
          } catch (error) {
            console.error("Unable to copy diagnostic links", error);
            if (status) {
              status.textContent = "Copy failed. Please try again.";
            }
          }
        })().catch((err) => console.error("Copy handler failed", err));
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

    selectionInputs.forEach((input) => {
      input.addEventListener("change", (event) => {
        const target = event.target;

        if (!(target instanceof HTMLInputElement)) {
          return;
        }

        if (target.checked) {
          selection.add(target.value);
        } else {
          selection.delete(target.value);
        }

        saveSelection(selection);
        updateBundleControls();
      });
    });

    downloadButton?.addEventListener("click", () => {
      if (!selection.size) {
        announceSelectionRequired(
          "Select at least one mechanism to download the bundle.",
          bundleStatus,
        );
        return;
      }
      const payloads = getSelectedPayloads();
      const markdown = composePatternBundle(payloads);

      triggerDownload(markdown, "mechanism-bundle.md", "text/markdown");
    });

    printButton?.addEventListener("click", () => {
      if (!selection.size) {
        announceSelectionRequired(
          "Select at least one mechanism to save the bundle as PDF.",
          bundleStatus,
        );
        return;
      }
      const payloads = getSelectedPayloads();
      const markdown = composePatternBundle(payloads);

      openPrintView(markdown);
    });

    copyBundleButton?.addEventListener("click", () => {
      if (!selection.size) {
        announceSelectionRequired(
          "Select at least one mechanism to copy a bundle link.",
          bundleStatus,
        );
        return;
      }
      void (async () => {
        const link = getBundleLink();
        const defaultLabel =
          copyBundleButton.textContent?.trim() ?? "Copy bundle link";

        try {
          await navigator.clipboard.writeText(link);
          copyBundleButton.textContent = "Copied";
          window.setTimeout(() => {
            copyBundleButton.textContent = defaultLabel;
          }, 1400);
        } catch (error) {
          console.error("Unable to copy bundle link", error);
        }
      })().catch((err) => console.error("Copy handler failed", err));
    });

    emailForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!selection.size) {
        announceSelectionRequired(
          "Select at least one mechanism to draft a bundle email.",
          emailStatus,
        );
        return;
      }

      const email = emailInput?.value.trim();

      if (!email) {
        if (emailStatus) {
          emailStatus.textContent =
            "Add an email to draft your bundle message.";
        }
        emailInput?.focus();
        return;
      }

      const payloads = getSelectedPayloads();
      const markdown = composePatternBundle(payloads);
      const link = getBundleLink();
      const body = `${markdown}\n\nBundle link: ${link}`;

      const mailto = new URL("mailto:" + encodeURIComponent(email));
      mailto.searchParams.set("subject", "Mechanism bundle links");
      mailto.searchParams.set("body", body);

      window.location.href = mailto.toString();

      if (emailStatus) {
        emailStatus.textContent =
          "Opening your email client with the bundle link.";
      }
    });

    saveFiltersButton?.addEventListener("click", saveFilters);
    restoreFiltersButton?.addEventListener("click", restoreFilters);
    clearFiltersButton?.addEventListener("click", clearFilters);
    window.addEventListener("popstate", handlePopState);
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
