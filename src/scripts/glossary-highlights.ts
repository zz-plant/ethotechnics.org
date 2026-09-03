import { glossaryContent, glossaryTerms } from "../content/glossary";
import { glossaryEntryPermalink } from "../utils/glossary";

type GlossaryHighlightEntry = {
  term: string;
  slug: string;
  definition: string;
  href: string;
  domain?: string;
  metric?: string;
  threshold?: string;
  scale?: string;
};

const normalizeDefinition = (definition: string): string => {
  const cleaned = definition.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 220) {
    return cleaned;
  }

  return `${cleaned.slice(0, 217)}…`;
};

// Index category entries for rich evidence metrics
const fullEntriesMap = new Map(
  glossaryContent.categories.flatMap((cat) =>
    cat.entries.map((entry) => [entry.id, entry]),
  ),
);

const glossaryEntries: GlossaryHighlightEntry[] = glossaryTerms.map(
  ({ term, slug, definition }) => {
    const fullEntry = fullEntriesMap.get(slug);
    const domain = fullEntry?.domains?.[0];
    const metric = fullEntry?.minimumEvidence?.metric;
    const threshold = fullEntry?.minimumEvidence?.threshold;
    const scale = fullEntry?.scale ?? undefined;

    return {
      term,
      slug,
      definition: normalizeDefinition(definition),
      href: glossaryEntryPermalink(slug),
      domain,
      metric: metric && metric.length < 40 ? metric : undefined,
      threshold: threshold && threshold.length < 45 ? threshold : undefined,
      scale,
    };
  },
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
  ".glossary-peek-card",
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

  const tooltipId = `glossary-peek-${entry.slug}-${highlightIndex}`;
  mark.setAttribute("aria-describedby", tooltipId);
  mark.setAttribute("aria-label", `Glossary term: ${matchText}`);

  const textNode = document.createTextNode(matchText);
  mark.appendChild(textNode);

  const card = document.createElement("span");
  card.id = tooltipId;
  card.className = "glossary-peek-card";
  card.setAttribute("role", "tooltip");

  const header = document.createElement("span");
  header.className = "glossary-peek-card__header";

  const title = document.createElement("span");
  title.className = "glossary-peek-card__title";
  title.textContent = entry.term;
  header.appendChild(title);

  if (entry.domain) {
    const badge = document.createElement("span");
    badge.className = "glossary-peek-card__badge";
    badge.textContent = entry.domain.toUpperCase();
    header.appendChild(badge);
  }
  card.appendChild(header);

  const def = document.createElement("span");
  def.className = "glossary-peek-card__def";
  def.textContent = entry.definition;
  card.appendChild(def);

  if (entry.metric || entry.threshold) {
    const metricGrid = document.createElement("span");
    metricGrid.className = "glossary-peek-card__metrics";

    if (entry.metric) {
      const chip = document.createElement("span");
      chip.className = "glossary-peek-card__metric-item";
      const lbl = document.createElement("span");
      lbl.className = "glossary-peek-card__metric-lbl";
      lbl.textContent = "METRIC";
      const val = document.createElement("span");
      val.className = "glossary-peek-card__metric-val";
      val.textContent = entry.metric;
      chip.appendChild(lbl);
      chip.appendChild(val);
      metricGrid.appendChild(chip);
    }

    if (entry.threshold) {
      const chip = document.createElement("span");
      chip.className = "glossary-peek-card__metric-item";
      const lbl = document.createElement("span");
      lbl.className = "glossary-peek-card__metric-lbl";
      lbl.textContent = "TARGET";
      const val = document.createElement("span");
      val.className = "glossary-peek-card__metric-val";
      val.textContent = entry.threshold;
      chip.appendChild(lbl);
      chip.appendChild(val);
      metricGrid.appendChild(chip);
    }
    card.appendChild(metricGrid);
  }

  const footer = document.createElement("span");
  footer.className = "glossary-peek-card__footer";
  const link = document.createElement("a");
  link.href = entry.href;
  link.className = "glossary-peek-card__link";
  link.textContent = "Inspect full standard →";
  footer.appendChild(link);
  card.appendChild(footer);

  mark.appendChild(card);
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

// The card is centred on its term with `left: 50%` and a -50% translate, which
// says nothing about whether the result is on screen. It usually was not: on a
// 412px viewport every card on the home page fell outside it, because a card is
// up to 24rem wide and a term can sit anywhere across the column. Measured on
// open and the difference handed back to CSS as `--peek-shift`, so the card
// stays anchored to its term until doing so would push it off the edge.
// Wide enough that the card still clears the edge under a shadow, a rounded
// corner and a rendered box that measures slightly wider than its layout box.
const VIEWPORT_MARGIN = 16;

const positionPeekCard = (mark: HTMLElement): void => {
  const card = mark.querySelector<HTMLElement>(".glossary-peek-card");
  if (!card) {
    return;
  }

  // Measure unshifted, or the previous correction is read as the new position
  // and the card walks sideways each time it is opened.
  card.style.setProperty("--peek-shift", "0px");
  card.removeAttribute("data-peek-placement");

  const rect = card.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;

  let shift = 0;
  if (rect.left < VIEWPORT_MARGIN) {
    shift = VIEWPORT_MARGIN - rect.left;
  } else if (rect.right > viewportWidth - VIEWPORT_MARGIN) {
    shift = viewportWidth - VIEWPORT_MARGIN - rect.right;
  }

  if (shift !== 0) {
    card.style.setProperty("--peek-shift", `${Math.round(shift)}px`);
  }

  // A term on the first line of a page opened its card upwards into the
  // header. Flip below when the space above cannot hold it.
  const markRect = mark.getBoundingClientRect();
  if (markRect.top - rect.height < VIEWPORT_MARGIN) {
    card.setAttribute("data-peek-placement", "below");
  }
};

const watchPeekCard = (mark: HTMLElement): void => {
  // Positioned on open rather than up front: the measurement depends on where
  // the term has been scrolled to, and on a resize or a font swap the answer
  // changes.
  mark.addEventListener("pointerenter", () => positionPeekCard(mark));
  mark.addEventListener("focusin", () => positionPeekCard(mark));
};

document
  .querySelectorAll<HTMLElement>(".glossary-highlight")
  .forEach(watchPeekCard);

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
