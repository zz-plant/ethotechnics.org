import { glossaryTerms } from "../content/glossary";
import { glossaryEntryPermalink } from "../utils/glossary";

type GlossaryHighlightEntry = {
  term: string;
  slug: string;
  definition: string;
  href: string;
};

const normalizeDefinition = (definition: string): string => {
  const cleaned = definition.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 200) {
    return cleaned;
  }

  return `${cleaned.slice(0, 197)}…`;
};

const glossaryEntries: GlossaryHighlightEntry[] = glossaryTerms.map(
  ({ term, slug, definition }) => ({
    term,
    slug,
    definition: normalizeDefinition(definition),
    href: glossaryEntryPermalink(slug),
  }),
);

const termLookup = new Map(
  glossaryEntries.map((entry) => [entry.term.toLowerCase(), entry]),
);
const sortedTerms = glossaryEntries
  .map((entry) => entry.term)
  .sort((a, b) => b.length - a.length);

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const glossaryRegex = new RegExp(
  `\\b(${sortedTerms.map(escapeRegExp).join("|")})\\b`,
  "gi",
);

const highlightRoots = document.querySelectorAll<HTMLElement>(
  "[data-glossary-highlights]",
);

const ignoredSelector = [
  "a",
  "button",
  "code",
  "input",
  "option",
  "pre",
  "script",
  "select",
  "style",
  "textarea",
  "[data-glossary-ignore]",
  ".glossary-highlight",
].join(", ");

const shouldSkipTextNode = (node: Text): boolean => {
  const parent = node.parentElement;
  if (!parent) {
    return true;
  }

  return Boolean(parent.closest(ignoredSelector));
};

let highlightIndex = 0;

const buildHighlightMark = (
  matchText: string,
  entry: GlossaryHighlightEntry,
): HTMLElement => {
  highlightIndex++;
  const mark = document.createElement("mark");
  mark.className = "glossary-highlight";
  mark.setAttribute("tabindex", "0");
  mark.setAttribute("role", "button");
  mark.setAttribute("data-glossary-slug", entry.slug);

  const tooltipId = `glossary-tooltip-${entry.slug}-${highlightIndex}`;
  mark.setAttribute("aria-describedby", tooltipId);
  mark.setAttribute("aria-label", `Glossary term: ${matchText}`);

  const textNode = document.createTextNode(matchText);
  mark.appendChild(textNode);

  const tooltip = document.createElement("span");
  tooltip.id = tooltipId;
  tooltip.className = "glossary-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.textContent = entry.definition;

  mark.appendChild(tooltip);
  return mark;
};

const replaceGlossaryTerms = (node: Text): void => {
  const text = node.textContent;
  if (!text) {
    return;
  }

  const matches = Array.from(text.matchAll(glossaryRegex));
  if (matches.length === 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  let lastIndex = 0;

  matches.forEach((match) => {
    const matchText = match[0];
    const matchIndex = match.index ?? 0;
    const entry = termLookup.get(matchText.toLowerCase());

    fragment.append(text.slice(lastIndex, matchIndex));

    if (entry) {
      fragment.append(buildHighlightMark(matchText, entry));
    } else {
      fragment.append(matchText);
    }

    lastIndex = matchIndex + matchText.length;
  });

  fragment.append(text.slice(lastIndex));
  node.replaceWith(fragment);
};

highlightRoots.forEach((root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (shouldSkipTextNode(node as Text)) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => replaceGlossaryTerms(node));
});

const toggleGlossaryHighlights = (enabled: boolean) => {
  document.body.classList.toggle("disable-glossary-highlights", !enabled);
  const highlights = document.querySelectorAll(".glossary-highlight");
  highlights.forEach((el) => {
    if (enabled) {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
    } else {
      el.removeAttribute("tabindex");
      el.removeAttribute("role");
    }
  });
};

const toggleCheckbox = document.getElementById(
  "glossary-toggle",
) as HTMLInputElement | null;
if (toggleCheckbox) {
  const stored = localStorage.getItem("glossary-highlights");
  const initiallyEnabled = stored !== "disabled";
  toggleCheckbox.checked = initiallyEnabled;
  toggleGlossaryHighlights(initiallyEnabled);

  toggleCheckbox.addEventListener("change", () => {
    const enabled = toggleCheckbox.checked;
    localStorage.setItem(
      "glossary-highlights",
      enabled ? "enabled" : "disabled",
    );
    toggleGlossaryHighlights(enabled);
  });
}
