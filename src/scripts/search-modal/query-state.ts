import {
  MAX_RECENT_SEARCHES,
  RECENT_SEARCH_KEY,
  SEARCH_MODAL_PARAM,
  SEARCH_QUERY_PARAM,
  SEARCH_QUERY_STORAGE_KEY,
} from "./types";

export type UrlStateSync = {
  getParam: (name: string) => string | null;
  setModalOpen: (open: boolean, mode?: "push" | "replace") => void;
  setQuery: (query: string, mode?: "push" | "replace") => void;
  clearModalAndQuery: (mode?: "push" | "replace") => void;
};

export type SearchStorage = {
  setQuery: (query: string) => void;
  getQuery: () => string;
  setRecentSearch: (value: string) => void;
  getRecentSearches: () => string[];
};

export const serializeQuery = (query: string) => query.trim().toLowerCase();

export const createUrlStateSync = (win: Window): UrlStateSync => {
  const updateUrlParams = (
    mutate: (params: URLSearchParams) => void,
    mode: "push" | "replace" = "replace",
  ) => {
    const url = new URL(win.location.href);
    mutate(url.searchParams);

    if (mode === "push") {
      win.history.pushState({}, "", url.toString());
      return;
    }

    win.history.replaceState({}, "", url.toString());
  };

  return {
    getParam: (name) => new URLSearchParams(win.location.search).get(name),
    setModalOpen: (open, mode = "replace") => {
      updateUrlParams((params) => {
        if (open) {
          params.set(SEARCH_MODAL_PARAM, "1");
          return;
        }

        params.delete(SEARCH_MODAL_PARAM);
      }, mode);
    },
    setQuery: (query, mode = "replace") => {
      updateUrlParams((params) => {
        if (query.trim()) {
          params.set(SEARCH_QUERY_PARAM, query.trim());
          return;
        }

        params.delete(SEARCH_QUERY_PARAM);
      }, mode);
    },
    clearModalAndQuery: (mode = "push") => {
      updateUrlParams((params) => {
        params.delete(SEARCH_MODAL_PARAM);
        params.delete(SEARCH_QUERY_PARAM);
      }, mode);
    },
  };
};

export const createSearchStorage = (storage: {
  localStorage: Storage;
  sessionStorage: Storage;
}): SearchStorage => ({
  setQuery: (query) => {
    storage.sessionStorage.setItem(SEARCH_QUERY_STORAGE_KEY, query);
  },
  getQuery: () =>
    storage.sessionStorage.getItem(SEARCH_QUERY_STORAGE_KEY) ?? "",
  setRecentSearch: (value) => {
    if (!value.trim()) return;

    const existing = JSON.parse(
      storage.localStorage.getItem(RECENT_SEARCH_KEY) ?? "[]",
    ) as string[];
    const updated = [value, ...existing.filter((item) => item !== value)].slice(
      0,
      MAX_RECENT_SEARCHES,
    );
    storage.localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
  },
  getRecentSearches: () =>
    JSON.parse(
      storage.localStorage.getItem(RECENT_SEARCH_KEY) ?? "[]",
    ) as string[],
});

export const searchStateParams = {
  modal: SEARCH_MODAL_PARAM,
  query: SEARCH_QUERY_PARAM,
};
