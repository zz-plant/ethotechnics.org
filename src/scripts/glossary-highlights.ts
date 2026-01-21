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

const buildHighlightLink = (
  matchText: string,
  entry: GlossaryHighlightEntry,
): HTMLAnchorElement => {
  const link = document.createElement("a");
  link.className = "glossary-highlight";
  link.href = entry.href;
  link.textContent = matchText;
  link.setAttribute("data-definition", entry.definition);
  link.setAttribute("data-glossary-slug", entry.slug);
  link.setAttribute("aria-label", `${matchText}: ${entry.definition}`);
  return link;
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
      fragment.append(buildHighlightLink(matchText, entry));
    } else {
      fragment.append(matchText);
    }

    lastIndex = matchIndex + matchText.length;
  });

  fragment.append(text.slice(lastIndex));
  node.replaceWith(fragment);
};

highlightRoots.forEach((root) => {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (shouldSkipTextNode(node as Text)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => replaceGlossaryTerms(node));
});
