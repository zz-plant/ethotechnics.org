import {
  CONTENT_TYPE_MAP,
  GROUP_LABELS,
  OTHER_GROUP_LABEL,
  type PagefindResultData,
} from "./types";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export type SearchRenderer = {
  showEmpty: (message?: string) => void;
  showLoading: () => void;
  showFallback: (lead: string, linkText: string, query: string) => void;
  setBusy: (isBusy: boolean) => void;
  renderResults: (results: PagefindResultData[], query: string) => void;
};

export const applyHighlight = (element: HTMLElement, query: string) => {
  if (!query) return;
  const text = element.textContent ?? "";
  if (!text) return;
  const escapedQuery = escapeRegExp(query);
  const highlightRegex = new RegExp(escapedQuery, "gi");
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = highlightRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      fragment.append(text.slice(lastIndex, match.index));
    }
    const mark = document.createElement("mark");
    mark.textContent = match[0];
    fragment.append(mark);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    fragment.append(text.slice(lastIndex));
  }

  element.replaceChildren(fragment);
};

/**
 * Pagefind returns the excerpt as HTML: escaped page text with <mark> around
 * each matched word. Parse it in an inert document and copy across only the
 * text and the marks, so nothing else in an excerpt becomes markup here.
 */
export const renderExcerpt = (element: HTMLElement, excerpt: string) => {
  const parsed = new DOMParser().parseFromString(excerpt, "text/html");
  const nodes = Array.from(parsed.body.childNodes, (node) => {
    const text = node.textContent ?? "";
    if (node.nodeName !== "MARK") return document.createTextNode(text);
    const mark = document.createElement("mark");
    mark.textContent = text;
    return mark;
  });
  element.replaceChildren(...nodes);
};

const createResultHTML = (result: PagefindResultData, query: string) => {
  const wrapper = document.createElement("article");
  wrapper.className = "search-result";
  const title = result.meta.title;
  const excerpt = result.excerpt.replace(/\s+/g, " ").trim();

  const metaLabels = [
    result.meta.type,
    result.meta.section,
    result.meta.category,
    result.meta.contentType,
  ]
    .filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    )
    .map(
      (value) =>
        CONTENT_TYPE_MAP[value] ??
        CONTENT_TYPE_MAP[value.toLowerCase()] ??
        value,
    );

  const link = document.createElement("a");
  link.href = result.url;

  const titleElement = document.createElement("div");
  titleElement.className = "search-result__title";
  titleElement.textContent = title;
  link.appendChild(titleElement);

  if (metaLabels.length) {
    const meta = document.createElement("div");
    meta.className = "search-result__meta";
    metaLabels.forEach((label) => {
      const pill = document.createElement("span");
      pill.textContent = label;
      meta.appendChild(pill);
    });
    link.appendChild(meta);
  }

  const excerptElement = document.createElement("p");
  excerptElement.className = "search-result__excerpt";
  renderExcerpt(excerptElement, excerpt);
  link.appendChild(excerptElement);

  wrapper.appendChild(link);

  if (query) {
    applyHighlight(titleElement, query);
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
        OTHER_GROUP_LABEL;
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

export const createSearchRenderer = (
  container: HTMLElement,
): SearchRenderer => {
  const showEmpty = (message = "Results appear here as you type.") => {
    const text = document.createElement("p");
    text.className = "search-empty";
    text.textContent = message;
    container.replaceChildren(text);
  };

  // When full-text search cannot answer, the search page still can: it filters
  // titles and summaries without Pagefind.
  const showFallback = (lead: string, linkText: string, query: string) => {
    const text = document.createElement("p");
    text.className = "search-empty";
    const link = document.createElement("a");
    link.href = `/search?q=${encodeURIComponent(query)}`;
    link.textContent = linkText;
    text.appendChild(document.createTextNode(`${lead} `));
    text.appendChild(link);
    text.appendChild(document.createTextNode("."));
    container.replaceChildren(text);
  };

  return {
    showEmpty,
    showLoading: () => showEmpty("Searching…"),
    showFallback,
    setBusy: (isBusy) => {
      container.setAttribute("aria-busy", isBusy ? "true" : "false");
    },
    renderResults: (results, query) => {
      container.replaceChildren();

      if (!results.length) {
        showEmpty(
          `No pages match “${query}”. Try a shorter term or an ID like STD-01.`,
        );
        return;
      }

      const groups = groupResults(results);
      const labels = sortGroupLabels(groups);

      labels.forEach((label) => {
        const group = document.createElement("section");
        group.className = "search-results__group";
        const title = document.createElement("h3");
        title.className = "search-results__group-title";
        title.textContent = label;
        group.appendChild(title);
        const list = document.createElement("div");
        list.className = "search-results__list";
        groups[label].forEach((result) => {
          list.appendChild(createResultHTML(result, query));
        });
        group.appendChild(list);
        container.appendChild(group);
      });
    },
  };
};
