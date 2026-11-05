import casebookData from "../../data/casebook.json" with { type: "json" };
import { normalizePath } from "./route-type";
import { resolveOgTemplate, type OgTemplate } from "./og-template";

/**
 * Share-card layouts for /api/og.svg and /api/og.png.
 *
 * Most shares land in a group chat, where the card is a thumbnail between
 * messages. What gets a tap there is a fact the reader did not have: a
 * number, a verdict, a duration. So the cards that can carry one do: a
 * casebook entry shows its scale, its six-safeguard score, and how long the
 * system ran before it was stopped; the home page and casebook index chart
 * those durations side by side; a glossary entry reads as a dictionary entry.
 * Every other page gets a section card whose ground colour tells the
 * sections apart at thumbnail size.
 *
 * Everything is drawn as plain SVG text and shapes: resvg (which renders the
 * PNG every share actually uses) has no foreignObject, no text layout, and
 * only the three font files handed to it.
 */

export const WIDTH = 1200;
export const HEIGHT = 630;

const PAPER = "#faf8f5";
const INK = "#1c1917";
const NIGHT = "#171412";
const CREAM = "#f1ece3";
const STONE = "#57534e";
const DUSK = "#a8a29e";
const BORDER = "#e6e2da";
const SAPPHIRE = "#1e3a5f";
const TEAL = "#2e5266";
const RUST = "#b5481f";
const RUST_LIGHT = "#e6996e";
const AMBER = "#d9a441";
const SAGE = "#8db596";

// Single-quoted family names: these are interpolated into double-quoted XML
// attributes, where a nested double quote ends the attribute early.
const SERIF =
  "'Source Serif 4', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";
const SANS =
  "'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const MARGIN = 80;
const RIGHT = WIDTH - MARGIN;
const CONTENT_WIDTH = RIGHT - MARGIN;

export const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

/**
 * Per-character advance estimates as a fraction of font size. SVG has no text
 * layout, so lines have to be broken here; measuring properly would mean
 * parsing font metrics for a job where being a few percent out just leaves a
 * slightly short line.
 */
const NARROW = new Set([..."iljtIfr.,;:'!|()[]-’"]);
const WIDE = new Set([..."mwMW@%"]);

export const estimateTextWidth = (
  text: string,
  fontSize: number,
  letterSpacing = 0,
) => {
  let units = 0;
  let count = 0;
  for (const character of text) {
    count += 1;
    if (NARROW.has(character)) units += 0.31;
    else if (WIDE.has(character)) units += 0.92;
    else if (character === " ") units += 0.26;
    else if (character >= "0" && character <= "9") units += 0.54;
    else if (character >= "A" && character <= "Z") units += 0.68;
    else units += 0.52;
  }
  return units * fontSize + count * letterSpacing;
};

/** Greedy wrap; anything past maxLines is folded back with an ellipsis. */
export const wrapText = (
  text: string,
  maxWidth: number,
  fontSize: number,
  maxLines: number,
) => {
  const lines: string[] = [];
  let current = "";

  for (const word of text.split(" ")) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && estimateTextWidth(candidate, fontSize) > maxWidth) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current = candidate;
    }
  }

  if (lines.length < maxLines && current) lines.push(current);

  const consumed = lines.join(" ");
  if (consumed.length < text.length && lines.length > 0) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = `${last.replace(/[.,;:]$/, "")}…`;
  }

  return lines;
};

/**
 * The largest size, stepping down from `max`, at which `text` fits in
 * `maxLines` lines without being cut. Falls back to `min` and lets the wrap
 * ellipsize.
 */
const fitText = (
  text: string,
  maxWidth: number,
  sizes: { max: number; min: number },
  maxLines: number,
) => {
  for (let size = sizes.max; size >= sizes.min; size -= 2) {
    const lines = wrapText(text, maxWidth, size, maxLines);
    if (!lines.at(-1)?.endsWith("…")) return { size, lines };
  }
  return {
    size: sizes.min,
    lines: wrapText(text, maxWidth, sizes.min, maxLines),
  };
};

const tspans = (lines: string[], x: number, top: number, leading: number) =>
  lines
    .map(
      (line, index) =>
        `<tspan x="${x}" y="${Math.round(top + index * leading)}">${escapeXml(line)}</tspan>`,
    )
    .join("");

/**
 * The section mark from public/favicon.svg, scaled from its 32-unit tile.
 * Kept in sync by eye rather than by import: this file has to run inside a
 * Worker, where reading the SVG off disk is not an option.
 */
const MARK_HALF =
  "M20.93 10.02 C20.93 7.38 18.29 5.79 15.38 6.41 " +
  "C12.22 7.11 11.07 10.28 13.36 12.22 L18.64 17.41";

const mark = (x: number, y: number, size: number, tile: string, ink: string) =>
  `<g transform="translate(${x} ${y}) scale(${size / 32})">
    <rect width="32" height="32" rx="7" fill="${tile}"/>
    <g fill="none" stroke="${ink}" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="${MARK_HALF}"/>
      <path d="${MARK_HALF}" transform="rotate(180 16 16)"/>
    </g>
  </g>`;

/** A large, faint copy of the mark bleeding off the bottom-right corner. */
const watermark = (colour: string, opacity: number) =>
  `<g opacity="${opacity}" transform="translate(${WIDTH - 330} ${HEIGHT - 300}) scale(13)">
    <g fill="none" stroke="${colour}" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="${MARK_HALF}"/>
      <path d="${MARK_HALF}" transform="rotate(180 16 16)"/>
    </g>
  </g>`;

/** Brand row: mark, "ETHOTECHNICS" and a section word after a thin bar. */
const brandRow = (options: {
  section: string;
  tile: string;
  tileInk: string;
  brandInk: string;
  sectionInk: string;
}) => {
  const brand = "ETHOTECHNICS";
  const brandWidth = estimateTextWidth(brand, 20, 3.4);
  const barX = MARGIN + 56 + brandWidth + 14;
  return `${mark(MARGIN, 64, 40, options.tile, options.tileInk)}
  <text x="${MARGIN + 56}" y="92" font-family="${SANS}" font-size="20" font-weight="600" letter-spacing="3.4" fill="${options.brandInk}">${brand}</text>
  <rect x="${barX}" y="74" width="2" height="22" fill="${options.brandInk}" opacity="0.45"/>
  <text x="${barX + 16}" y="92" font-family="${SANS}" font-size="20" font-weight="600" letter-spacing="3.4" fill="${options.sectionInk}">${escapeXml(options.section.toUpperCase())}</text>`;
};

const svgDocument = (title: string, body: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img">
  <title>${escapeXml(title)}</title>
  ${body}
</svg>`;

/* -------------------------------------------------------------------------- */
/* Casebook data                                                              */
/* -------------------------------------------------------------------------- */

type Verdict = "held" | "drifted" | "failed";

type CaseRecord = {
  slug: string;
  title: string;
  jurisdiction: string;
  period: string;
  scale: string;
  timeToHalt: string;
  timeToHaltDays: number;
  findings: { variable: string; verdict: Verdict }[];
};

const stateVariables = casebookData.stateVariables as {
  id: string;
  label: string;
}[];
/**
 * Plain words for the six safeguards. A card reaches people who have never
 * seen the site, so it cannot use the casebook's own terms ("standing",
 * "dependency"). Each restates the gloss on the home page's scorecard.
 */
const CARD_LABEL: Record<string, string> = {
  capability: "Scope",
  authority: "Permission",
  evidence: "Evidence",
  dependency: "Exit",
  standing: "Appeal",
  correction: "Repair",
};
const cases = casebookData.cases as unknown as CaseRecord[];
const casesBySlug = new Map(cases.map((entry) => [entry.slug, entry]));

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
};

const countWord = (count: number) => {
  const word = Object.keys(NUMBER_WORDS).find(
    (key) => NUMBER_WORDS[key] === count,
  );
  return word ? word[0].toUpperCase() + word.slice(1) : String(count);
};

/** "~7 years" reads as "tilde 7 years" aloud; alt text spells it out. */
const spokenFigure = (figure: string) => figure.replace(/^~/, "about ");

/**
 * Turns the casebook's own wording ("About seventeen months to a policy
 * change; the model was not withdrawn.") into a figure for the card
 * ("~17 months") and what it measured up to ("to a policy change"). The
 * casebook's phrase is the source so the card and the page never disagree.
 */
export const parseTimeToHalt = (phrase: string) => {
  const head = phrase.split(/[;.]/)[0].trim();
  const approximate = /^(about|roughly|around|nearly|almost)\s+/i.test(head);
  const withoutQualifier = head.replace(
    /^(about|roughly|around|nearly|almost)\s+/i,
    "",
  );
  const tailMatch = withoutQualifier.match(/\s(to|until|before)\s(.+)$/i);
  const span = tailMatch
    ? withoutQualifier.slice(0, tailMatch.index).trim()
    : withoutQualifier;
  const figure = span
    .toLowerCase()
    .replace(/\s+and\s+/g, " ")
    .replace(/\b([a-z]+)\b/g, (word) =>
      word in NUMBER_WORDS ? String(NUMBER_WORDS[word]) : word,
    );
  return {
    figure: `${approximate ? "~" : ""}${figure}`,
    until: tailMatch ? `${tailMatch[1]} ${tailMatch[2]}` : undefined,
  };
};

/** "Australia · Services Australia (Centrelink)" → "Australia". */
const countryOf = (jurisdiction: string) =>
  jurisdiction.split("·")[0]?.trim() ?? jurisdiction;

/** "1999 to 2015 (prosecutions); redress continuing" → "1999 to 2015". */
const shortPeriod = (period: string) =>
  period
    .split(";")[0]
    .replace(/\s*\([^)]*\)/g, "")
    .trim();

/**
 * The first sentence of the case's scale line, cut back at a clause boundary
 * when it runs long, so the card leads with the number.
 */
export const scaleHook = (scale: string, max = 112) => {
  const sentence = (scale.match(/^.*?[.!?](\s|$)/)?.[0] ?? scale).trim();
  if (sentence.length <= max) return sentence;
  const clauses = sentence.split(";");
  let hook = clauses[0].trim();
  for (const clause of clauses.slice(1)) {
    const next = `${hook};${clause}`;
    if (next.length > max) break;
    hook = next.trim();
  }
  return hook;
};

const caseSlugFromPath = (path?: string) => {
  const match = normalizePath(path ?? "/").match(/^\/casebook\/([^/]+)\/?$/i);
  return match?.[1]?.toLowerCase();
};

/* -------------------------------------------------------------------------- */
/* Casebook entry                                                             */
/* -------------------------------------------------------------------------- */

const VERDICT_COLOUR: Record<Verdict, string> = {
  failed: RUST_LIGHT,
  drifted: AMBER,
  held: SAGE,
};

/**
 * The site's verdict marks, drawn: held is a filled disc, drifted a half
 * disc, failed an empty ring. They read in grayscale as well as in colour.
 */
const verdictMark = (cx: number, cy: number, r: number, verdict: Verdict) => {
  const colour = VERDICT_COLOUR[verdict];
  const ring = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colour}" stroke-width="4"/>`;
  if (verdict === "held") {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colour}" stroke="${colour}" stroke-width="4"/>`;
  }
  if (verdict === "drifted") {
    return `${ring}<path d="M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} Z" fill="${colour}"/>`;
  }
  return ring;
};

/** What a case card says, shared by the image and its alt text. */
const caseFacts = (entry: CaseRecord) => {
  const { figure, until } = parseTimeToHalt(entry.timeToHalt);
  const hook = scaleHook(entry.scale).replace(/[^.!?]$/, "$&.");
  const counts = { failed: 0, drifted: 0, held: 0 };
  for (const finding of entry.findings) counts[finding.verdict] += 1;
  const tally = (["failed", "drifted", "held"] as const)
    .filter((verdict) => counts[verdict] > 0)
    .map((verdict) => `${counts[verdict]} ${verdict}`);
  return { figure, until: until ?? "before it was stopped", hook, tally };
};

const buildCaseSvg = (entry: CaseRecord) => {
  const facts = caseFacts(entry);
  const { figure, until } = facts;
  const meta = `${countryOf(entry.jurisdiction)} · ${shortPeriod(entry.period)}`;

  // One line at display size if it fits; otherwise two lines, smaller.
  const oneLine = fitText(entry.title, CONTENT_WIDTH, { max: 96, min: 76 }, 1);
  const title = oneLine.lines[0]?.endsWith("…")
    ? fitText(entry.title, CONTENT_WIDTH, { max: 70, min: 54 }, 2)
    : oneLine;
  const titleLeading = Math.round(title.size * 1.04);
  const hook = wrapText(facts.hook, CONTENT_WIDTH, 30, 2);

  // Centre title and hook in the band between the brand row and the rule.
  const BAND_TOP = 128;
  const BAND_BOTTOM = 424;
  const blockHeight =
    title.size * 0.78 +
    (title.lines.length - 1) * titleLeading +
    48 +
    hook.length * 40 -
    8;
  const titleTop = Math.round(
    BAND_TOP + (BAND_BOTTOM - BAND_TOP - blockHeight) / 2 + title.size * 0.78,
  );
  const titleBottom = titleTop + (title.lines.length - 1) * titleLeading;
  const hookTop = titleBottom + 56;

  const RULE_Y = 444;
  const verdictByVariable = new Map(
    entry.findings.map((finding) => [finding.variable, finding.verdict]),
  );
  const tally = facts.tally.join(" · ");

  // Left: the duration. Right: the six safeguards.
  const statWidth = 420;
  const statSize = Math.max(
    40,
    Math.min(72, Math.floor((statWidth / estimateTextWidth(figure, 1)) * 0.98)),
  );
  const scoreLeft = MARGIN + statWidth + 70;
  const column = (RIGHT - scoreLeft) / stateVariables.length;
  const marks = stateVariables
    .map((variable, index) => {
      const verdict = verdictByVariable.get(variable.id);
      const cx = Math.round(scoreLeft + column * index + column / 2);
      return `${verdict ? verdictMark(cx, 528, 17, verdict) : ""}
      <text x="${cx}" y="574" text-anchor="middle" font-family="${SANS}" font-size="15" fill="${DUSK}">${escapeXml(CARD_LABEL[variable.id] ?? variable.label)}</text>`;
    })
    .join("");

  return svgDocument(
    `${entry.title}: casebook entry — Ethotechnics`,
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${NIGHT}"/>
  <rect width="${WIDTH}" height="10" fill="${RUST}"/>
  ${brandRow({ section: "Casebook", tile: RUST, tileInk: NIGHT, brandInk: DUSK, sectionInk: RUST_LIGHT })}
  <text x="${RIGHT}" y="92" text-anchor="end" font-family="${SANS}" font-size="20" fill="${DUSK}">${escapeXml(meta)}</text>
  <text font-family="${SERIF}" font-size="${title.size}" font-weight="600" fill="${CREAM}">${tspans(title.lines, MARGIN, titleTop, titleLeading)}</text>
  <text font-family="${SANS}" font-size="30" fill="${CREAM}" opacity="0.86">${tspans(hook, MARGIN, hookTop, 40)}</text>
  <line x1="${MARGIN}" y1="${RULE_Y}" x2="${RIGHT}" y2="${RULE_Y}" stroke="${CREAM}" stroke-opacity="0.16" stroke-width="2"/>
  <text x="${MARGIN}" y="${RULE_Y + 92}" font-family="${SERIF}" font-size="${statSize}" font-weight="600" fill="${RUST_LIGHT}">${escapeXml(figure)}</text>
  <text x="${MARGIN}" y="${RULE_Y + 132}" font-family="${SANS}" font-size="20" font-weight="600" fill="${DUSK}">${escapeXml(until)}</text>
  <text x="${scoreLeft + 8}" y="${RULE_Y + 40}" font-family="${SANS}" font-size="17" font-weight="600" letter-spacing="2.4" fill="${DUSK}">SIX SAFEGUARDS</text>
  <text x="${RIGHT - 8}" y="${RULE_Y + 40}" text-anchor="end" font-family="${SANS}" font-size="19" font-weight="600" fill="${CREAM}">${escapeXml(tally)}</text>
  ${marks}`,
  );
};

/* -------------------------------------------------------------------------- */
/* Home and casebook index: time to halt, charted                             */
/* -------------------------------------------------------------------------- */

const buildHaltChartSvg = (section: string) => {
  const rows = [...cases].sort((a, b) => b.timeToHaltDays - a.timeToHaltDays);
  const longest = rows[0]?.timeToHaltDays ?? 1;

  // Two short sentences, one per line: a question gets read in a chat
  // where a long statement gets skimmed. "Stepped in" covers a halt and
  // Apple Card's policy change alike.
  const headline = [
    `${countWord(rows.length)} automated systems got it wrong.`,
    "How long until someone stepped in?",
  ];

  const LABEL_WIDTH = 330;
  const barLeft = MARGIN + LABEL_WIDTH;
  const barMax = RIGHT - barLeft - 210;
  const rowTop = 290;
  const rowHeight = 56;

  const bars = rows
    .map((entry, index) => {
      const y = rowTop + index * rowHeight;
      const width = Math.max(
        8,
        Math.round((entry.timeToHaltDays / longest) * barMax),
      );
      const { figure, until } = parseTimeToHalt(entry.timeToHalt);
      const value = until
        ? `${figure}, ${until.replace(/^to /, "to ")}`
        : figure;
      const valueLines = wrapText(value, RIGHT - (barLeft + width + 16), 22, 1);
      const isLongest = index === 0;
      return `<text x="${barLeft - 24}" y="${y + 27}" text-anchor="end" font-family="${SANS}" font-size="22" font-weight="600" fill="${INK}">${escapeXml(wrapText(entry.title, LABEL_WIDTH - 24, 22, 1)[0] ?? "")}</text>
      <rect x="${barLeft}" y="${y + 6}" width="${width}" height="30" rx="4" fill="${isLongest ? RUST : SAPPHIRE}"/>
      <text x="${barLeft + width + 16}" y="${y + 29}" font-family="${SANS}" font-size="22" font-weight="${isLongest ? 600 : 400}" fill="${isLongest ? RUST : STONE}">${escapeXml(valueLines[0] ?? "")}</text>`;
    })
    .join("");

  return svgDocument(
    `${headline.join(" ")} — Ethotechnics`,
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <rect width="${WIDTH}" height="10" fill="${SAPPHIRE}"/>
  ${brandRow({ section, tile: SAPPHIRE, tileInk: PAPER, brandInk: STONE, sectionInk: SAPPHIRE })}
  <text x="${RIGHT}" y="92" text-anchor="end" font-family="${SANS}" font-size="20" fill="${STONE}">ethotechnics.org/casebook</text>
  <text font-family="${SERIF}" font-size="52" font-weight="600" fill="${INK}">${tspans(headline, MARGIN, 180, 60)}</text>
  <line x1="${barLeft}" y1="${rowTop - 8}" x2="${barLeft}" y2="${rowTop + rows.length * rowHeight - 12}" stroke="${BORDER}" stroke-width="2"/>
  ${bars}
  <text x="${MARGIN}" y="${HEIGHT - 26}" font-family="${SANS}" font-size="17" fill="${STONE}">Each established by a court, an inquiry, or a regulator. Each scored on six safeguards.</text>`,
  );
};

/* -------------------------------------------------------------------------- */
/* Glossary entry                                                             */
/* -------------------------------------------------------------------------- */

const GLOSSARY_SUFFIX = /\s+[—–-]\s+Ethotechnics glossary$/i;

const buildGlossarySvg = (title: string, description: string) => {
  const term = title.replace(GLOSSARY_SUFFIX, "").trim() || title;
  // The page's meta description leads with "Term:"; the card already shows it.
  const prefix = new RegExp(
    `^${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*`,
    "i",
  );
  const definition = description.replace(prefix, "");
  const head = fitText(term, CONTENT_WIDTH, { max: 92, min: 60 }, 2);
  const headLeading = Math.round(head.size * 1.04);
  const headTop = 172 + Math.round(head.size * 0.78);
  const headBottom = headTop + (head.lines.length - 1) * headLeading;
  const ruleY = headBottom + 40;
  const body = wrapText(
    definition,
    CONTENT_WIDTH - 40,
    32,
    head.lines.length > 1 ? 3 : 4,
  );

  return svgDocument(
    `${term} — Ethotechnics glossary`,
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  ${watermark(TEAL, 0.05)}
  <rect width="${WIDTH}" height="10" fill="${TEAL}"/>
  ${brandRow({ section: "Glossary", tile: TEAL, tileInk: PAPER, brandInk: STONE, sectionInk: TEAL })}
  <text x="${RIGHT}" y="92" text-anchor="end" font-family="${SANS}" font-size="20" fill="${STONE}">Defined term</text>
  <text font-family="${SERIF}" font-size="${head.size}" font-weight="600" fill="${INK}">${tspans(head.lines, MARGIN, headTop, headLeading)}</text>
  <rect x="${MARGIN}" y="${ruleY}" width="96" height="6" rx="3" fill="${TEAL}"/>
  <rect x="${MARGIN}" y="${ruleY + 34}" width="4" height="${body.length * 44 - 6}" fill="${BORDER}"/>
  <text font-family="${SERIF}" font-size="32" fill="${INK}" opacity="0.9">${tspans(body, MARGIN + 32, ruleY + 34 + 30, 44)}</text>`,
  );
};

/* -------------------------------------------------------------------------- */
/* Section card (every other page)                                            */
/* -------------------------------------------------------------------------- */

type SectionStyle = {
  label: string;
  kicker: string;
  ground: string;
  ink: string;
  muted: string;
  accent: string;
  tile: string;
  tileInk: string;
};

const LIGHT = { ground: PAPER, ink: INK, muted: STONE };
const DARK = { ink: CREAM, muted: DUSK };

/**
 * The ground colour separates the sections at thumbnail size: a standards
 * link and a research link should not look like the same card in a chat.
 * All four grounds come from theme.css.
 */
const sectionStyles: Record<OgTemplate, SectionStyle> = {
  default: {
    ...LIGHT,
    label: "Reference",
    kicker: "Keeping automated decisions answerable",
    accent: SAPPHIRE,
    tile: SAPPHIRE,
    tileInk: PAPER,
  },
  home: {
    ...LIGHT,
    label: "Institute",
    kicker: "Open standards for answerable automated decisions",
    accent: SAPPHIRE,
    tile: SAPPHIRE,
    tileInk: PAPER,
  },
  standards: {
    ...DARK,
    ground: SAPPHIRE,
    label: "Standards",
    kicker: "Clauses a running system can fail",
    accent: RUST_LIGHT,
    tile: RUST_LIGHT,
    tileInk: SAPPHIRE,
  },
  glossary: {
    ...LIGHT,
    label: "Glossary",
    kicker: "Defined terms the standards use",
    accent: TEAL,
    tile: TEAL,
    tileInk: PAPER,
  },
  taxonomy: {
    ...LIGHT,
    label: "Taxonomy",
    kicker: "Design and governance domains in context",
    accent: TEAL,
    tile: TEAL,
    tileInk: PAPER,
  },
  mechanisms: {
    ...DARK,
    ground: TEAL,
    label: "Mechanisms",
    kicker: "Safeguards for halting, challenge, and repair",
    accent: "#f3d3b4",
    tile: "#f3d3b4",
    tileInk: TEAL,
  },
  editorial: {
    ...DARK,
    ground: NIGHT,
    label: "Editorial",
    kicker: "Research, incidents, and field notes",
    accent: RUST_LIGHT,
    tile: RUST,
    tileInk: NIGHT,
  },
};

const buildSectionSvg = (
  template: OgTemplate,
  title: string,
  description: string,
) => {
  const style = sectionStyles[template];
  const titleFit = fitText(title, CONTENT_WIDTH, { max: 76, min: 54 }, 3);
  const titleLeading = Math.round(titleFit.size * 1.08);
  const descriptionLines = wrapText(
    description,
    CONTENT_WIDTH - 80,
    28,
    titleFit.lines.length > 2 ? 1 : 2,
  );

  // Centre the text block between the brand row and the footer rule, so a
  // one-line title does not leave a hole and a three-line one does not crowd.
  const BAND_TOP = 140;
  const BAND_BOTTOM = 486;
  const blockHeight =
    titleFit.lines.length * titleLeading +
    (descriptionLines.length > 0 ? 24 + descriptionLines.length * 40 : 0);
  const titleTop = Math.round(
    BAND_TOP +
      (BAND_BOTTOM - BAND_TOP - blockHeight) / 2 +
      titleFit.size * 0.78,
  );
  const descriptionTop =
    titleTop + (titleFit.lines.length - 1) * titleLeading + 24 + 40;

  return svgDocument(
    `${title} — Ethotechnics`,
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${style.ground}"/>
  ${watermark(style.accent, style.ground === PAPER ? 0.06 : 0.07)}
  <rect width="${WIDTH}" height="10" fill="${style.accent}"/>
  ${brandRow({ section: style.label, tile: style.tile, tileInk: style.tileInk, brandInk: style.muted, sectionInk: style.accent })}
  <text font-family="${SERIF}" font-size="${titleFit.size}" font-weight="600" fill="${style.ink}">${tspans(titleFit.lines, MARGIN, titleTop, titleLeading)}</text>
  <text font-family="${SANS}" font-size="28" fill="${style.ink}" opacity="0.78">${tspans(descriptionLines, MARGIN, descriptionTop, 40)}</text>
  <line x1="${MARGIN}" y1="512" x2="${RIGHT}" y2="512" stroke="${style.ink}" stroke-opacity="0.14" stroke-width="2"/>
  <text x="${MARGIN}" y="556" font-family="${SANS}" font-size="22" font-weight="600" fill="${style.accent}">${escapeXml(style.kicker)}</text>
  <text x="${RIGHT}" y="556" text-anchor="end" font-family="${SANS}" font-size="22" fill="${style.muted}">ethotechnics.org</text>`,
  );
};

/* -------------------------------------------------------------------------- */
/* Dispatch                                                                   */
/* -------------------------------------------------------------------------- */

export type OgCardKind = "case" | "halt-chart" | "glossary" | "section";

export const resolveOgCard = (options?: {
  template?: string;
  path?: string;
}): { kind: OgCardKind; template: OgTemplate; slug?: string } => {
  const template = resolveOgTemplate(options?.template, options?.path);
  const path = normalizePath(options?.path ?? "/").toLowerCase();
  const slug = caseSlugFromPath(options?.path);

  if (slug && casesBySlug.has(slug)) return { kind: "case", template, slug };
  if (options?.path && (path === "/" || path === "/casebook")) {
    return { kind: "halt-chart", template };
  }
  if (template === "glossary" && path.startsWith("/glossary/")) {
    return { kind: "glossary", template };
  }
  return { kind: "section", template };
};

export const buildOgCardSvg = (
  title: string,
  description: string,
  options?: { template?: string; path?: string },
) => {
  const card = resolveOgCard(options);
  switch (card.kind) {
    case "case":
      return buildCaseSvg(casesBySlug.get(card.slug ?? "") as CaseRecord);
    case "halt-chart":
      return buildHaltChartSvg(
        card.template === "home" ? "Institute" : "Casebook",
      );
    case "glossary":
      return buildGlossarySvg(title, description);
    default:
      return buildSectionSvg(card.template, title, description);
  }
};

/**
 * Alt text for the cards that carry data, so a screen reader, or a chat app
 * that shows alt in place of the image, gets the same facts. Undefined for
 * cards that only restate the page title and description.
 */
export const describeOgCard = (options?: {
  template?: string;
  path?: string;
}): string | undefined => {
  const card = resolveOgCard(options);
  if (card.kind === "case") {
    const entry = casesBySlug.get(card.slug ?? "");
    if (!entry) return undefined;
    const facts = caseFacts(entry);
    return `${entry.title}, casebook entry. ${facts.hook} ${spokenFigure(facts.figure)} ${facts.until}. Six safeguards scored: ${facts.tally.join(", ")}.`;
  }
  if (card.kind === "halt-chart") {
    const rows = [...cases]
      .sort((a, b) => b.timeToHaltDays - a.timeToHaltDays)
      .map((entry) => {
        const { figure, until } = parseTimeToHalt(entry.timeToHalt);
        return `${entry.title}, ${spokenFigure(figure)}${until ? ` ${until}` : ""}`;
      });
    return `Bar chart: ${countWord(cases.length).toLowerCase()} automated systems that got it wrong, and how long until someone stepped in. ${rows.join("; ")}.`;
  }
  return undefined;
};
