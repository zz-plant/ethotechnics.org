import { SEARCH_GROUPS } from "../../utils/seo/route-type";

export type HapticPattern = "nudge" | "success" | "error";

export type HapticOptions = {
  intensity?: number;
};

export type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: {
    title: string;
    /** The page's search group, from utils/seo/route-type. */
    type?: string;
  };
};

export type PagefindSearchResult = {
  data: () => Promise<PagefindResultData>;
};

export type PagefindModule = {
  options: (options: { excerptLength: number }) => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindSearchResult[] }>;
};

export type SearchInstance = {
  container: HTMLElement;
  trigger: HTMLButtonElement;
  dialog: HTMLDialogElement;
  scope?: string;
  isActive: () => boolean;
  isDialogOpen: () => boolean;
  openDialog: (options?: { pushHistory?: boolean }) => void;
  closeDialog: (options?: { fromHistory?: boolean }) => void;
  syncDialogWithUrl: () => void;
  handleDocumentClick: (event: MouseEvent) => void;
};

export const PAGEFIND_PATH = "/pagefind/pagefind.js";
export const SEARCH_RESULTS_LIMIT = 12;
export const SEARCH_DEBOUNCE_MS = 200;
export const RECENT_SEARCH_KEY = "et3-search-recent";
export const SEARCH_QUERY_STORAGE_KEY = "et3-search-query";
export const MAX_RECENT_SEARCHES = 6;
export const OTHER_GROUP_LABEL = "Other pages";
// Every page names its group in its Pagefind metadata; a result without one
// comes from an index built before the groups existed.
export const GROUP_LABELS: readonly string[] = [
  ...SEARCH_GROUPS,
  OTHER_GROUP_LABEL,
];
export const SEARCH_MODAL_PARAM = "modal";
export const SEARCH_QUERY_PARAM = "q";
