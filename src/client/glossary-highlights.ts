import type { GlossaryHighlightEntry } from "../content/page-data/glossary-highlight-index";

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightRoots = document.querySelectorAll<HTMLElement>(
  "[data-glossary-highlights]",
);

// Terms are marked up inside running prose. Labels are not prose: a definition
// tooltip on a breadcrumb, a column header, or a page kicker adds a hover
// target where the reader is orienting, not reading. All three shipped --
// /evals/ underlined "Ethotechnics" in its own breadcrumb trail, the home page
// comparison table underlined it in a `th` next to a plain sibling header, and
// the home hero underlined the first word of its eyebrow.
const ignoredSelector = [
  "a",
  // A framework island owns its DOM. Marking a term inside one changed the
  // text React was about to hydrate, and /diagnostics/delegation-audit threw
  // a hydration error on every load.
  "astro-island",
  "button",
  "code",
  // A heading names the section; it is where the reader orients, not where
  // they read. /method rendered its own h1 with "Ethotechnics" underlined and
  // focusable, and STD-01 marked five of its article titles.
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "input",
  "nav",
  "option",
  "pre",
  "script",
  "select",
  "style",
  // A `summary` is a button. A focusable mark inside one nests a control in a
  // control, which axe reports as nested-interactive on /standards/std-01.
  "summary",
  // An `svg[role="img"]` is one atomic image, and its `title`/`desc` are its
  // accessible name and description rather than prose. Marking terms there
  // both nests controls inside the image and corrupts the name a screen
  // reader announces.
  "svg",
  "textarea",
  "th",
  "[data-glossary-ignore]",
  // Kickers are labels too, and they are not all `.eyebrow` -- the home hero
  // uses `.institute-hero__eyebrow`.
  '[class*="eyebrow"]',
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

  if (entry.href) {
    const footer = document.createElement("span");
    footer.className = "glossary-peek-card__footer";
    const link = document.createElement("a");
    link.href = entry.href;
    link.className = "glossary-peek-card__link";
    link.textContent = "Read the full entry →";
    footer.appendChild(link);
    card.appendChild(footer);
  }

  mark.appendChild(card);
  return mark;
};

/**
 * A term inside an email address, domain, or path is part of that address,
 * not a use of the term: "hello@ethotechnics.org" rendered as
 * "hello@" + a tooltip + ".org" on the participate page.
 */
const isInsideAddress = (text: string, start: number, end: number): boolean => {
  const before = text[start - 1] ?? "";
  const after = text.slice(end, end + 2);
  return /[@./\\]/.test(before) || /^[@]|^\.[a-z0-9]/i.test(after);
};

/**
 * Marks each term where the page first uses it. Marking every use put 29
 * underlined, focusable copies of "insulation" on the essay about insulation,
 * each a tab stop with its own card, and buried the terms that appear once.
 */
const highlightTerms = (entries: GlossaryHighlightEntry[]): void => {
  const termLookup = new Map(
    entries.map((entry) => [entry.term.toLowerCase(), entry]),
  );
  const sortedTerms = entries
    .map((entry) => entry.term)
    .sort((a, b) => b.length - a.length);
  const glossaryRegex = new RegExp(
    `\\b(${sortedTerms.map(escapeRegExp).join("|")})\\b`,
    "gi",
  );
  const highlightedSlugs = new Set<string>();

  const replaceGlossaryTerms = (node: Text): void => {
    const text = node.textContent;
    if (!text) {
      return;
    }

    const matches = Array.from(text.matchAll(glossaryRegex)).filter((match) => {
      const entry = termLookup.get(match[0].toLowerCase());
      const index = match.index ?? 0;
      if (
        !entry ||
        highlightedSlugs.has(entry.slug) ||
        isInsideAddress(text, index, index + match[0].length)
      ) {
        return false;
      }
      highlightedSlugs.add(entry.slug);
      return true;
    });
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
};

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

// The term list is fetched, and only by a page with prose to mark: glossary
// pages and two standards opt out, and used to download it anyway. A failed
// fetch leaves the prose unmarked, which is how it reads without scripts.
const loadAndHighlight = async (): Promise<void> => {
  const response = await fetch("/glossary/highlight-index.json");
  if (!response.ok) {
    return;
  }

  const entries: GlossaryHighlightEntry[] = await response.json();
  highlightTerms(entries);
  document
    .querySelectorAll<HTMLElement>(".glossary-highlight")
    .forEach(watchPeekCard);
};

if (highlightRoots.length > 0) {
  loadAndHighlight().catch(() => undefined);
}
