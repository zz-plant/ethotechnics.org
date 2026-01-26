type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: {
    title: string;
    type?: string;
    section?: string;
    category?: string;
    contentType?: string;
  };
};

type PagefindSearchResult = {
  data: () => Promise<PagefindResultData>;
};

type PagefindModule = {
  options: (options: { excerptLength: number }) => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindSearchResult[] }>;
};

const PAGEFIND_PATH = "/pagefind/pagefind.js";
const SEARCH_RESULTS_LIMIT = 12;
const SEARCH_DEBOUNCE_MS = 200;
const RECENT_SEARCH_KEY = "et3-search-recent";
const SEARCH_QUERY_STORAGE_KEY = "et3-search-query";
const MAX_RECENT_SEARCHES = 6;
const GROUP_LABELS = [
  "Standards",
  "Validators",
  "Mechanisms",
  "Research",
  "Other",
];
const SEARCH_MODAL_PARAM = "modal";
const SEARCH_QUERY_PARAM = "q";
const CONTENT_TYPE_MAP: Record<string, string> = {
  standards: "Standards",
  standard: "Standards",
  validators: "Validators",
  validator: "Validators",
  mechanisms: "Mechanisms",
  mechanism: "Mechanisms",
  research: "Research",
  paper: "Research",
  report: "Research",
};

let pagefindPromise: Promise<PagefindModule | null> | null = null;
let pagefindConfigured = false;

const loadPagefind = async () => {
  if (pagefindPromise) return pagefindPromise;

  pagefindPromise = import(
    /* @vite-ignore */
    PAGEFIND_PATH
  )
    .then((module) => module as PagefindModule)
    .catch((error) => {
      console.warn("Pagefind not found. Search may not work in dev mode.", error);
      pagefindPromise = null;
      return null;
    });

  return pagefindPromise;
};

const initPagefind = async () => {
  const loadedPagefind = await loadPagefind();
  if (!loadedPagefind) {
    return null;
  }

  if (!pagefindConfigured) {
    await loadedPagefind.options({
      excerptLength: 20,
    });
    pagefindConfigured = true;
  }

  return loadedPagefind;
};

type SearchInstance = {
  container: HTMLElement;
  trigger: HTMLButtonElement | null;
  dialog: HTMLDialogElement | null;
  scope?: string;
  isActive: () => boolean;
  isDialogOpen: () => boolean;
  openDialog: (options?: { pushHistory?: boolean }) => void;
  closeDialog: (options?: { fromHistory?: boolean }) => void;
  syncDialogWithUrl: () => void;
  handleDocumentClick: (event: MouseEvent) => void;
};

const initSearch = () => {
  const searchContainers = Array.from(
    document.querySelectorAll<HTMLElement>("[data-search-container]"),
  );
  const searchInstances: SearchInstance[] = [];
  const mediaQuery = window.matchMedia("(min-width: 992px)");
  const getActiveScope = () => (mediaQuery.matches ? "desktop" : "mobile");
  const getActiveInstance = () =>
    searchInstances.find((instance) => instance.isActive()) ??
    searchInstances[0];
  let listenersBound = false;

  const bindGlobalListeners = () => {
    if (listenersBound) return;
    listenersBound = true;

    document.addEventListener("keydown", (event) => {
      const activeInstance = getActiveInstance();
      if (
        event.key === "/" &&
        activeInstance &&
        !activeInstance.isDialogOpen() &&
        !(
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        )
      ) {
        event.preventDefault();
        activeInstance.openDialog({ pushHistory: true });
      }
    });

    document.addEventListener("click", (event) => {
      searchInstances.forEach((instance) =>
        instance.handleDocumentClick(event),
      );
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

  const setRecentSearches = (value: string) => {
    if (!value.trim()) return;

    const existing = JSON.parse(
      localStorage.getItem(RECENT_SEARCH_KEY) ?? "[]",
    ) as string[];
    const updated = [value, ...existing.filter((item) => item !== value)].slice(
      0,
      MAX_RECENT_SEARCHES,
    );
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
  };

  const getRecentSearches = () =>
    JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) ?? "[]") as string[];

  const updateRecentSearches = (
    list: HTMLElement,
    handler: (value: string) => void,
  ) => {
    const recent = getRecentSearches();
    list.innerHTML = "";

    recent.forEach((item) => {
      const button = document.createElement("button");
      button.className = "search-recent__button";
      button.type = "button";
      button.textContent = item;
      button.addEventListener("click", () => handler(item));
      list.appendChild(button);
    });
  };

  const createResultHTML = (result: PagefindResultData, query: string) => {
    const wrapper = document.createElement("article");
    wrapper.className = "search-result";
    const title = result.meta.title;
    const excerpt = result.excerpt.replace(/\s+/g, " ").trim();
    const url = result.url;

    const metaLabels = [
      result.meta.type,
      result.meta.section,
      result.meta.category,
      result.meta.contentType,
    ]
      .filter(
        (value): value is string =>
          typeof value === "string" && value.length > 0,
      )
      .map((value) => {
        return (
          CONTENT_TYPE_MAP[value] ??
          CONTENT_TYPE_MAP[value.toLowerCase()] ??
          value
        );
      });

    wrapper.innerHTML = `
      <a href="${url}">
        <div class="search-result__title">${title}</div>
        ${
          metaLabels.length
            ? `<div class="search-result__meta">${metaLabels
                .map((label) => `<span>${label}</span>`)
                .join("")}</div>`
            : ""
        }
        <p class="search-result__excerpt">${excerpt}</p>
      </a>
    `;

    if (query) {
      wrapper
        .querySelectorAll<HTMLElement>(
          ".search-result__title, .search-result__excerpt",
        )
        .forEach((node) => {
          node.innerHTML = node.innerHTML.replace(
            new RegExp(`(${query})`, "gi"),
            "<mark>$1</mark>",
          );
        });
    }

    return wrapper;
  };

  const groupResults = (results: PagefindResultData[]) =>
    results.reduce(
      (groups, result) => {
        const type =
          CONTENT_TYPE_MAP[result.meta.type ?? ""] ??
          CONTENT_TYPE_MAP[result.meta.contentType ?? ""] ??
          CONTENT_TYPE_MAP[result.meta.section ?? ""] ??
          "Other";
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(result);
        return groups;
      },
      {} as Record<string, PagefindResultData[]>,
    );

  const sortGroupLabels = (groups: Record<string, PagefindResultData[]>) => {
    const availableLabels = Object.keys(groups);
    const labels = GROUP_LABELS.filter((label) =>
      availableLabels.includes(label),
    );
    const otherLabels = availableLabels.filter(
      (label) => !GROUP_LABELS.includes(label),
    );

    return [...labels, ...otherLabels];
  };

  const renderGroupedResults = (
    container: HTMLElement,
    results: PagefindResultData[],
    query: string,
  ) => {
    container.innerHTML = "";

    if (!results.length) {
      container.innerHTML =
        "<p class=\"search-empty\">No matches yet. Try another term.</p>";
      return;
    }

    const groups = groupResults(results);
    const labels = sortGroupLabels(groups);

    labels.forEach((label) => {
      const group = document.createElement("section");
      group.className = "search-results__group";
      group.innerHTML = `<h3 class="search-results__group-title">${label}</h3>`;
      const list = document.createElement("div");
      list.className = "search-results__list";
      groups[label].forEach((result) => {
        list.appendChild(createResultHTML(result, query));
      });
      group.appendChild(list);
      container.appendChild(group);
    });
  };

  const serializeQuery = (query: string) => query.trim().toLowerCase();

  const setQueryToStorage = (query: string) => {
    sessionStorage.setItem(SEARCH_QUERY_STORAGE_KEY, query);
  };

  const getQueryFromStorage = () =>
    sessionStorage.getItem(SEARCH_QUERY_STORAGE_KEY) ?? "";

  const clearSearchResults = (container: HTMLElement) => {
    container.innerHTML =
      "<p class=\"search-empty\">Start typing to search...</p>";
  };

  const bindSearchInstance = ({
    container,
    trigger,
    dialog,
    scope,
  }: {
    container: HTMLElement;
    trigger: HTMLButtonElement | null;
    dialog: HTMLDialogElement | null;
    scope?: string;
  }) => {
    if (!dialog || !trigger) return null;

    const input = dialog.querySelector<HTMLInputElement>("[data-search-input]");
    const results = dialog.querySelector<HTMLElement>(
      "[data-search-results]",
    );
    const recentWrapper = dialog.querySelector<HTMLElement>(
      "[data-search-recent]",
    );
    const recentList = dialog.querySelector<HTMLElement>(
      "[data-search-recent-list]",
    );
    const closeButton = dialog.querySelector<HTMLButtonElement>(
      "[data-search-close]",
    );
    if (!input || !results) return null;

    let searchTimeout: number | undefined;
    let focusReturn: Element | null = null;

    const setRecentVisibility = () => {
      if (!recentWrapper || !recentList) return;
      const recent = getRecentSearches();
      recentWrapper.hidden = recent.length === 0;
      updateRecentSearches(recentList, (value) => {
        input.value = value;
        input.dispatchEvent(new Event("input"));
      });
    };

    const applyQueryFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const query = params.get(SEARCH_QUERY_PARAM) ?? "";
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
        const url = new URL(window.location.href);
        url.searchParams.set(SEARCH_MODAL_PARAM, "1");
        window.history.pushState({}, "", url.toString());
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
        const url = new URL(window.location.href);
        url.searchParams.delete(SEARCH_MODAL_PARAM);
        url.searchParams.delete(SEARCH_QUERY_PARAM);
        window.history.pushState({}, "", url.toString());
      }

      input.value = "";
      clearSearchResults(results);
      setQueryToStorage("");
      if (focusReturn instanceof HTMLElement) {
        focusReturn.focus();
      }
    };

    const syncDialogWithUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const modalOpen = params.get(SEARCH_MODAL_PARAM);
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

    trigger.addEventListener("click", () => openDialog({ pushHistory: true }));
    closeButton?.addEventListener("click", () => closeDialog());

    dialog.addEventListener("close", () => {
      if (!dialog.open) {
        focusReturn = null;
      }
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeDialog();
      }
    });

    const searchResults = async (query: string) => {
      const trimmed = serializeQuery(query);
      if (!trimmed) {
        clearSearchResults(results);
        setRecentVisibility();
        return;
      }

      const pagefind = await initPagefind();
      if (!pagefind) {
        results.innerHTML =
          "<p class=\"search-empty\">Search is unavailable right now.</p>";
        return;
      }

      const response = await pagefind.search(trimmed);
      const data = await Promise.all(
        response.results
          .slice(0, SEARCH_RESULTS_LIMIT)
          .map((result) => result.data()),
      );
      setQueryToStorage(trimmed);
      setRecentSearches(trimmed);
      setRecentVisibility();
      renderGroupedResults(results, data, trimmed);
    };

    const scheduleSearch = (query: string) => {
      if (searchTimeout) {
        window.clearTimeout(searchTimeout);
      }
      searchTimeout = window.setTimeout(() => {
        searchResults(query).catch((error) => {
          console.warn("Search failed.", error);
        });
      }, SEARCH_DEBOUNCE_MS);
    };

    input.addEventListener("input", () => {
      const value = input.value;
      scheduleSearch(value);

      const url = new URL(window.location.href);
      if (value.trim()) {
        url.searchParams.set(SEARCH_QUERY_PARAM, value.trim());
      } else {
        url.searchParams.delete(SEARCH_QUERY_PARAM);
      }
      window.history.replaceState({}, "", url.toString());
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
      }
    });

    const bindKeyboardNavigation = () => {
      const focusableSelector = ".search-result a";
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const currentIndex = focusable.findIndex(
        (element) => element === document.activeElement,
      );

      return { focusable, currentIndex };
    };

    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const { focusable } = bindKeyboardNavigation();
        focusable[0]?.focus();
      }
    });

    dialog.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;

      const { focusable, currentIndex } = bindKeyboardNavigation();
      if (!focusable.length) return;

      event.preventDefault();
      if (event.key === "ArrowDown") {
        const nextIndex = currentIndex + 1;
        (focusable[nextIndex] ?? focusable[0]).focus();
      } else {
        const prevIndex = currentIndex - 1;
        (focusable[prevIndex] ?? focusable[focusable.length - 1]).focus();
      }
    });

    syncDialogWithUrl();

    return {
      container,
      trigger,
      dialog,
      scope,
      isActive: () =>
        scope === undefined || scope === null || scope === getActiveScope(),
      isDialogOpen: () => Boolean(dialog?.open),
      openDialog,
      closeDialog,
      syncDialogWithUrl,
      handleDocumentClick,
    } as SearchInstance;
  };

  searchContainers.forEach((container) => {
    const instance = bindSearchInstance({
      container,
      trigger: container.querySelector("[data-search-trigger]"),
      dialog: container.querySelector("[data-search-dialog]"),
      scope: container.dataset.searchScope,
    });
    if (instance) {
      searchInstances.push(instance);
    }
  });

  if (searchInstances.length) {
    bindGlobalListeners();
  }

  const initialInstance = getActiveInstance();
  if (initialInstance) {
    const params = new URLSearchParams(window.location.search);
    if (params.get(SEARCH_MODAL_PARAM)) {
      initialInstance.openDialog();
    }
  }

  const storedQuery = getQueryFromStorage();
  if (storedQuery) {
    searchInstances.forEach((instance) => {
      if (instance.isDialogOpen()) {
        const input = instance.dialog?.querySelector<HTMLInputElement>(
          "[data-search-input]",
        );
        if (input) {
          input.value = storedQuery;
          input.dispatchEvent(new Event("input"));
        }
      }
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearch);
} else {
  initSearch();
}
