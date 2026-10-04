const BUNDLE_STORAGE_KEY = "pattern-bundle-selection";
const FILTER_STORAGE_KEY = "pattern-filter-state";

export type StoredFilterState = {
  filter: string | null;
  query: string;
};

export const loadSelection = () => {
  const saved = localStorage.getItem(BUNDLE_STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved) as string[];

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (value): value is string => typeof value === "string",
      );
    }
  } catch (error) {
    console.error("Unable to parse saved bundle selection", error);
  }

  return [];
};

export const saveSelection = (selection: Set<string>) => {
  localStorage.setItem(
    BUNDLE_STORAGE_KEY,
    JSON.stringify(Array.from(selection)),
  );
};

export const loadFilterState = (filters: string[]) => {
  const saved = localStorage.getItem(FILTER_STORAGE_KEY);

  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved) as {
      filter?: string | null;
      query?: string;
    };

    return {
      filter:
        parsed.filter && filters.includes(parsed.filter) ? parsed.filter : null,
      query: parsed.query ?? "",
    };
  } catch (error) {
    console.error("Unable to parse saved filters", error);
  }

  return null;
};

export const saveFilterState = (state: StoredFilterState) => {
  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state));
};
