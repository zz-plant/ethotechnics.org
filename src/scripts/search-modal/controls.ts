import { SEARCH_DEBOUNCE_MS, SEARCH_RESULTS_LIMIT, type HapticOptions, type HapticPattern, type SearchInstance } from "./types";
import { createSearchRenderer } from "./render";
import { searchStateParams, serializeQuery, type SearchStorage, type UrlStateSync } from "./query-state";
import type { PagefindAdapter } from "./pagefind";

export type SearchDependencies = {
  pagefind: PagefindAdapter;
  urlState: UrlStateSync;
  storage: SearchStorage;
  triggerHaptic: (pattern: HapticPattern, options?: HapticOptions) => void;
};

const isTypingContext = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest(
      "input, textarea, select, [contenteditable=''], [contenteditable='true'], [contenteditable='plaintext-only']",
    ),
  );
};

const getFocusableResults = (dialog: HTMLDialogElement) => {
  const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(".search-result a"));
  const currentIndex = focusable.findIndex((element) => element === document.activeElement);

  return { focusable, currentIndex };
};

export const bindSearchInstance = (
  { container, trigger, dialog, scope }: { container: HTMLElement; trigger: HTMLButtonElement; dialog: HTMLDialogElement; scope?: string },
  dependencies: SearchDependencies,
): SearchInstance | null => {
  const input = dialog.querySelector<HTMLInputElement>("[data-search-input]");
  const results = dialog.querySelector<HTMLElement>("[data-search-results]");
  const recentWrapper = dialog.querySelector<HTMLElement>("[data-search-recent]");
  const recentList = dialog.querySelector<HTMLElement>("[data-search-recent-list]");
  const closeButton = dialog.querySelector<HTMLButtonElement>("[data-search-close]");
  if (!input || !results) return null;

  const renderer = createSearchRenderer(results);
  let searchTimeout: number | undefined;
  let focusReturn: Element | null = null;

  const updateRecentSearches = (handler: (value: string) => void) => {
    if (!recentList) return;

    const recent = dependencies.storage.getRecentSearches();
    recentList.replaceChildren();

    recent.forEach((item) => {
      const button = document.createElement("button");
      button.className = "search-recent__button";
      button.type = "button";
      button.textContent = item;
      button.addEventListener("click", () => handler(item));
      recentList.appendChild(button);
    });
  };

  const setRecentVisibility = () => {
    if (!recentWrapper) return;
    const recent = dependencies.storage.getRecentSearches();
    recentWrapper.hidden = recent.length === 0;
    updateRecentSearches((value) => {
      input.value = value;
      input.dispatchEvent(new Event("input"));
    });
  };

  const applyQueryFromUrl = () => {
    const query = dependencies.urlState.getParam(searchStateParams.query) ?? "";
    if (query) {
      input.value = query;
      input.dispatchEvent(new Event("input"));
    }
  };

  const openDialog = ({ pushHistory = false } = {}) => {
    focusReturn = document.activeElement;
    if (!dialog.open) {
      dialog.showModal();
    }
    if (pushHistory) {
      dependencies.urlState.setModalOpen(true, "push");
    }

    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
    setRecentVisibility();
    applyQueryFromUrl();
  };

  const closeDialog = ({ fromHistory = false } = {}) => {
    if (!dialog.open) return;

    dialog.close();
    if (!fromHistory) {
      dependencies.urlState.clearModalAndQuery("push");
    }

    input.value = "";
    renderer.showEmpty();
    renderer.setBusy(false);
    dependencies.storage.setQuery("");

    if (focusReturn instanceof HTMLElement) {
      focusReturn.focus();
    }

    dependencies.triggerHaptic("nudge", { intensity: 0.2 });
  };

  const syncDialogWithUrl = () => {
    const modalOpen = dependencies.urlState.getParam(searchStateParams.modal);
    if (modalOpen) {
      openDialog();
    } else if (dialog.open) {
      closeDialog({ fromHistory: true });
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (event.target === dialog) {
      closeDialog();
    }
  };

  const searchResults = async (query: string) => {
    const trimmed = serializeQuery(query);
    if (!trimmed) {
      renderer.showEmpty();
      renderer.setBusy(false);
      setRecentVisibility();
      return;
    }

    renderer.setBusy(true);
    renderer.showLoading();

    const pagefind = await dependencies.pagefind.init();
    if (!pagefind) {
      renderer.setBusy(false);
      renderer.showEmpty("Search is unavailable right now.");
      return;
    }

    const response = await pagefind.search(trimmed);
    const data = await Promise.all(response.results.slice(0, SEARCH_RESULTS_LIMIT).map((result) => result.data()));
    dependencies.storage.setQuery(trimmed);
    dependencies.storage.setRecentSearch(trimmed);
    setRecentVisibility();
    renderer.renderResults(data, trimmed);
    renderer.setBusy(false);
  };

  const scheduleSearch = (query: string) => {
    if (searchTimeout) {
      window.clearTimeout(searchTimeout);
    }
    searchTimeout = window.setTimeout(() => {
      searchResults(query).catch((error) => {
        renderer.setBusy(false);
        renderer.showEmpty("Search failed. Please try again.");
        dependencies.triggerHaptic("error", { intensity: 0.35 });
        console.warn("Search failed.", error);
      });
    }, SEARCH_DEBOUNCE_MS);
  };

  trigger.addEventListener("click", () => {
    dependencies.triggerHaptic("nudge", { intensity: 0.3 });
    openDialog({ pushHistory: true });
  });

  closeButton?.addEventListener("click", () => closeDialog());

  dialog.addEventListener("close", () => {
    if (!dialog.open) {
      focusReturn = null;
    }
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.closest(".search-result a")) {
      dependencies.triggerHaptic("success", { intensity: 0.35 });
    }

    if (target.closest(".search-recent__button")) {
      dependencies.triggerHaptic("nudge", { intensity: 0.25 });
    }
  });

  input.addEventListener("input", () => {
    const value = input.value;
    scheduleSearch(value);
    dependencies.urlState.setQuery(value, "replace");
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key === "Enter") {
      const firstResult = dialog.querySelector<HTMLAnchorElement>(".search-result a");
      if (firstResult) {
        event.preventDefault();
        dependencies.triggerHaptic("success", { intensity: 0.35 });
        firstResult.click();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const { focusable } = getFocusableResults(dialog);
      focusable[0]?.focus();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (!dialog.open || !["ArrowDown", "ArrowUp"].includes(event.key)) return;

    const { focusable, currentIndex } = getFocusableResults(dialog);
    if (!focusable.length) return;

    event.preventDefault();
    if (event.key === "ArrowDown") {
      const nextIndex = currentIndex + 1;
      (focusable[nextIndex] ?? focusable[0]).focus();
      return;
    }

    const prevIndex = currentIndex - 1;
    (focusable[prevIndex] ?? focusable[focusable.length - 1]).focus();
  });

  syncDialogWithUrl();

  return {
    container,
    trigger,
    dialog,
    scope,
    isActive: () => true,
    isDialogOpen: () => dialog.open,
    openDialog,
    closeDialog,
    syncDialogWithUrl,
    handleDocumentClick,
  };
};

export const bindGlobalSearchListeners = ({
  searchInstances,
  getActiveInstance,
  mediaQuery,
  triggerHaptic,
}: {
  searchInstances: SearchInstance[];
  getActiveInstance: () => SearchInstance | undefined;
  mediaQuery: MediaQueryList;
  triggerHaptic: SearchDependencies["triggerHaptic"];
}) => {
  document.addEventListener("keydown", (event) => {
    const activeInstance = getActiveInstance();
    if (
      event.key === "/" &&
      activeInstance &&
      !activeInstance.isDialogOpen() &&
      !isTypingContext(document.activeElement)
    ) {
      event.preventDefault();
      triggerHaptic("nudge", { intensity: 0.25 });
      activeInstance.openDialog({ pushHistory: true });
    }
  });

  document.addEventListener("click", (event) => {
    searchInstances.forEach((instance) => instance.handleDocumentClick(event));
  });

  window.addEventListener("popstate", () => {
    searchInstances.forEach((instance) => instance.syncDialogWithUrl());
  });

  mediaQuery.addEventListener("change", () => {
    searchInstances.forEach((instance) => {
      if (instance.isDialogOpen()) {
        instance.closeDialog({ fromHistory: true });
      }
    });
  });
};
