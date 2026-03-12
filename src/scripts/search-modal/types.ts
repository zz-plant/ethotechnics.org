export type HapticPattern = "nudge" | "success" | "error";

export type HapticOptions = {
  intensity?: number;
};

export type HapticsController = {
  trigger: (pattern: HapticPattern, options?: HapticOptions) => Promise<void>;
};

export type PagefindResultData = {
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
export const GROUP_LABELS = [
  "Standards",
  "Validators",
  "Mechanisms",
  "Research",
  "Other",
];
export const SEARCH_MODAL_PARAM = "modal";
export const SEARCH_QUERY_PARAM = "q";
export const CONTENT_TYPE_MAP: Record<string, string> = {
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
