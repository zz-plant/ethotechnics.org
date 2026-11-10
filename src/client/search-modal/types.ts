export type HapticPattern = "nudge" | "success" | "error";

export type HapticOptions = {
  intensity?: number;
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
export const OTHER_GROUP_LABEL = "Other pages";
export const GROUP_LABELS = [
  "Standards",
  "Validators",
  "Mechanisms",
  "Research",
  "Glossary",
  "Casebook",
  "Diagnostics",
  "Field notes",
  "Explainers",
  "Evals",
  "Evidence packs",
  OTHER_GROUP_LABEL,
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
  // A page's type is the first segment of its address. Sections without a
  // name here are grouped under OTHER_GROUP_LABEL.
  glossary: "Glossary",
  casebook: "Casebook",
  diagnostics: "Diagnostics",
  "field-notes": "Field notes",
  explainers: "Explainers",
  evals: "Evals",
  "evidence-packs": "Evidence packs",
};
