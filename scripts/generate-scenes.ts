#!/usr/bin/env bun
/* eslint-disable no-console */
/**
 * generate-scenes.ts — renders the brand kit in docs/assets: social cards, a
 * header, a badge and small icons, every one at the size scripts/check-assets.ts
 * expects. Nothing on the site reads these; they are for listings, profiles and
 * posts that link to it.
 *
 * Usage: bun run assets:generate [--dry-run]
 *
 * Each scene is drawn here for its own frame, from the site's own parts, rather
 * than by scaling one picture into every frame. Until 2026-11-17 the kit was one
 * lockup in source.svg, centred at about a fifth of each frame, set in the
 * system sans and carrying a line the site no longer says anywhere
 * ("Accountable systems, made legible"). Two files nothing regenerated had also
 * gone stale: a screenshot of a home page since replaced (dark-og) and a crop
 * of an "Ethotechnics Studio" graphic (touch-icon). The parts now:
 *
 * - the mark is the section sign scripts/generate-icons.ts draws, on its tile;
 * - the wordmark is the header's (the `wordmark` symbol in
 *   src/components/SvgDefs.astro): ETHOTECHNICS over INSTITUTE, in the serif;
 * - the colours and the card layout are the share cards'
 *   (src/utils/seo/og-cards.ts), which take them from src/styles/theme.css;
 * - the faces are the three the share cards render with (src/assets/fonts);
 * - the words are read from the site when this runs, so the kit cannot keep a
 *   line the site has dropped: the question is the home page's h1, and the line
 *   under it is the home share card's kicker.
 *
 * It renders with resvg compiled to WebAssembly, as the icons and the share
 * cards do. The previous version shelled out to rsvg-convert and named a
 * system font, so it ran on one machine and drew whatever face that machine
 * had. resvg sees only the font files handed to it, and a missing one stops
 * the run.
 *
 * source.svg is written too: the stacked lockup on paper, as the design
 * reference check-assets.ts requires.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const ASSETS_DIR = join(ROOT, "docs", "assets");
const FONTS_DIR = join(ROOT, "src", "assets", "fonts");
const WASM_PATH = join(
  ROOT,
  "node_modules",
  "@resvg",
  "resvg-wasm",
  "index_bg.wasm",
);
const PROJECT = "ethotechnics.org";

/* -------------------------------------------------------------------------- */
/* Words, read from the site                                                  */
/* -------------------------------------------------------------------------- */

/** One capture from a source file, or a stopped run: a guessed line is worse than none. */
function readFromSite(file: string, pattern: RegExp, what: string): string {
  const match = readFileSync(join(ROOT, file), "utf8").match(pattern);
  const text = match?.[1]?.replace(/\s+/g, " ").trim();
  if (!text || /[<{]/.test(text)) {
    throw new Error(
      `generate-scenes: could not read ${what} from ${file}. Update the pattern here to match the page.`,
    );
  }
  return text;
}

/** The home page's h1. */
const QUESTION = readFromSite(
  "src/pages/index.astro",
  /<h1[^>]*>([\s\S]*?)<\/h1>/,
  "the home page's h1",
);
/** The kicker the home page's share card prints under its rule. */
const KICKER = readFromSite(
  "src/utils/seo/og-cards.ts",
  /\bhome:\s*\{[\s\S]*?kicker:\s*"([^"]+)"/,
  "the home share card's kicker",
);
/** The header wordmark's two lines (the `wordmark` symbol in SvgDefs.astro). */
const WORDMARK = "ETHOTECHNICS";
const WORDMARK_SUB = "INSTITUTE";

/* -------------------------------------------------------------------------- */
/* Palette and faces                                                          */
/* -------------------------------------------------------------------------- */

/* The share cards' colours (og-cards.ts), which are theme.css's. */
const PAPER = "#faf8f5";
const INK = "#1c1917";
const STONE = "#57534e";
const SAPPHIRE = "#1e3a5f";
const NIGHT = "#171412";
const CREAM = "#f1ece3";
const DUSK = "#a8a29e";
const RUST_LIGHT = "#e6996e";
/* The dark theme's accent (theme.css) and the dark favicon's tile and stroke (generate-icons.ts). */
const ACCENT_DARK = "#93b8dc";
const SAPPHIRE_LIFT = "#27496f";
const PAPER_DARK = "#f4f1ea";

type Ground = {
  ground: string;
  ink: string;
  muted: string;
  accent: string;
  tile: string;
  tileInk: string;
};

/** The home share card's ground. */
const LIGHT: Ground = {
  ground: PAPER,
  ink: INK,
  muted: STONE,
  accent: SAPPHIRE,
  tile: SAPPHIRE,
  tileInk: PAPER,
};
/** The dark theme: its ground, text and accent, with the dark favicon's tile. */
const DARK: Ground = {
  ground: NIGHT,
  ink: CREAM,
  muted: DUSK,
  accent: ACCENT_DARK,
  tile: SAPPHIRE_LIFT,
  tileInk: PAPER_DARK,
};
/** The standards share card's ground: sapphire, with the warm accent. */
const DEEP: Ground = {
  ground: SAPPHIRE,
  ink: CREAM,
  muted: DUSK,
  accent: RUST_LIGHT,
  tile: RUST_LIGHT,
  tileInk: SAPPHIRE,
};

type Face = { family: string; weight: 400 | 600; file: string };

const SERIF: Face = {
  family: "Source Serif 4",
  weight: 600,
  file: "source-serif-4-semibold-latin.ttf",
};
const SANS: Face = {
  family: "Source Sans 3",
  weight: 400,
  file: "source-sans-3-regular-latin.ttf",
};
const SANS_BOLD: Face = {
  family: "Source Sans 3",
  weight: 600,
  file: "source-sans-3-semibold-latin.ttf",
};

/** The header wordmark's tracking, and the share cards' brand-row tracking, in em. */
const WORDMARK_TRACKING = 0.08;
const SUB_TRACKING = 0.4;
const BRAND_TRACKING = 0.17;

/* -------------------------------------------------------------------------- */
/* Rendering and measuring                                                    */
/* -------------------------------------------------------------------------- */

type ResvgModule = typeof import("@resvg/resvg-wasm");

let resvg: ResvgModule | null = null;
let fontBuffers: Uint8Array[] = [];

async function loadRenderer() {
  const mod = await import("@resvg/resvg-wasm");
  await mod.initWasm(readFileSync(WASM_PATH));
  // readFileSync throws on a missing face, which is the point: resvg would
  // otherwise drop the text and still write a plausible picture.
  fontBuffers = [SERIF, SANS, SANS_BOLD].map(
    (face) => new Uint8Array(readFileSync(join(FONTS_DIR, face.file))),
  );
  resvg = mod;
}

function renderer(svg: string, width?: number) {
  if (!resvg) throw new Error("generate-scenes: renderer not loaded");
  return new resvg.Resvg(svg, {
    font: {
      fontBuffers,
      loadSystemFonts: false,
      defaultFontFamily: SANS.family,
    },
    ...(width ? { fitTo: { mode: "width" as const, value: width } } : {}),
  });
}

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const fontAttrs = (face: Face, size: number, tracking = 0) =>
  `font-family="${face.family}" font-weight="${face.weight}" font-size="${size}"${
    tracking ? ` letter-spacing="${(tracking * size).toFixed(3)}"` : ""
  }`;

type Metrics = { left: number; top: number; width: number; height: number };

const metricsCache = new Map<string, Metrics>();

/**
 * The ink box of a line of text, in em, measured by the renderer that will draw
 * it. SVG has no text layout, and an estimate that is a few percent out shows as
 * a lockup sitting off-centre in a frame whose only content is the lockup.
 */
function measure(text: string, face: Face, tracking = 0): Metrics {
  const key = `${face.file}|${tracking}|${text}`;
  const cached = metricsCache.get(key);
  if (cached) return cached;
  const SIZE = 100;
  const box = renderer(
    `<svg xmlns="http://www.w3.org/2000/svg" width="12000" height="400"><text x="1000" y="200" ${fontAttrs(face, SIZE, tracking)}>${escapeXml(text)}</text></svg>`,
  ).innerBBox();
  if (!box) {
    throw new Error(
      `generate-scenes: "${text}" drew nothing in ${face.family}`,
    );
  }
  const metrics = {
    left: (box.x - 1000) / SIZE,
    top: (box.y - 200) / SIZE,
    width: box.width / SIZE,
    height: box.height / SIZE,
  };
  metricsCache.set(key, metrics);
  return metrics;
}

type Anchor = "start" | "middle" | "end";

/** A line of text placed by its ink: `x` is its left edge, centre or right edge. */
function text(
  content: string,
  face: Face,
  size: number,
  x: number,
  baseline: number,
  fill: string,
  options: { anchor?: Anchor; tracking?: number; opacity?: number } = {},
): string {
  const { anchor = "start", tracking = 0, opacity } = options;
  const m = measure(content, face, tracking);
  const inkLeft =
    anchor === "start"
      ? x
      : anchor === "middle"
        ? x - (m.width * size) / 2
        : x - m.width * size;
  const origin = inkLeft - m.left * size;
  return `<text x="${origin.toFixed(2)}" y="${baseline.toFixed(2)}" ${fontAttrs(face, size, tracking)} fill="${fill}"${
    opacity === undefined ? "" : ` opacity="${opacity}"`
  }>${escapeXml(content)}</text>`;
}

/* -------------------------------------------------------------------------- */
/* Parts                                                                      */
/* -------------------------------------------------------------------------- */

/** Half of the section mark; the other half is this rotated 180° (generate-icons.ts). */
const MARK_HALF =
  "M20.93 10.02 C20.93 7.38 18.29 5.79 15.38 6.41 " +
  "C12.22 7.11 11.07 10.28 13.36 12.22 L18.64 17.41";

const markStrokes = (ink: string) =>
  `<g fill="none" stroke="${ink}" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="${MARK_HALF}"/>
      <path d="${MARK_HALF}" transform="rotate(180 16 16)"/>
    </g>`;

/** The mark on its tile, the favicon's drawing, at `size` px. `rx` is in the tile's 32 units. */
const tile = (
  x: number,
  y: number,
  size: number,
  fill: string,
  ink: string,
  rx = 7,
) =>
  `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(size / 32).toFixed(5)})">
    <rect width="32" height="32" rx="${rx}" fill="${fill}"/>
    ${markStrokes(ink)}
  </g>`;

/** The share cards' watermark: a large, faint mark bleeding off the bottom-right corner. */
const watermark = (width: number, height: number, g: Ground) => {
  const size = Math.min(height * 0.66, width * 0.36);
  return `<g opacity="${g.ground === PAPER ? 0.06 : 0.07}" transform="translate(${(width - size * 0.79).toFixed(2)} ${(height - size * 0.72).toFixed(2)}) scale(${(size / 32).toFixed(5)})">
    ${markStrokes(g.accent)}
  </g>`;
};

const svgDocument = (
  width: number,
  height: number,
  title: string,
  body: string,
) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <title>${escapeXml(title)}</title>
  ${body}
</svg>
`;

/**
 * The header's wordmark, its two lines centred on `cx`, with the top of the
 * capitals at `top`. Returns the drawing and where it ends.
 */
function wordmark(cx: number, top: number, size: number, g: Ground) {
  const main = measure(WORDMARK, SERIF, WORDMARK_TRACKING);
  const baseline = top - main.top * size;
  let body = text(WORDMARK, SERIF, size, cx, baseline, g.ink, {
    anchor: "middle",
    tracking: WORDMARK_TRACKING,
  });
  let bottom = baseline;
  // The header sets INSTITUTE at 10 to the wordmark's 22. Under about 9px it is
  // a grey smear, so a small lockup carries the name alone.
  const subSize = size * (10 / 22);
  if (subSize >= 9) {
    const sub = measure(WORDMARK_SUB, SERIF, SUB_TRACKING);
    const subBaseline = baseline + size * 0.36 - sub.top * subSize;
    body += text(WORDMARK_SUB, SERIF, subSize, cx, subBaseline, g.ink, {
      anchor: "middle",
      tracking: SUB_TRACKING,
      opacity: 0.78,
    });
    bottom = subBaseline;
  }
  return { body, bottom, width: main.width * size };
}

/** Height of `wordmark` at `size`, from the top of the capitals to its last baseline. */
function wordmarkHeight(size: number) {
  const main = measure(WORDMARK, SERIF, WORDMARK_TRACKING);
  const subSize = size * (10 / 22);
  if (subSize < 9) return -main.top * size;
  const sub = measure(WORDMARK_SUB, SERIF, SUB_TRACKING);
  return -main.top * size + size * 0.36 - sub.top * subSize;
}

/** Breaks `content` into `lines` lines so the longest is as short as it can be. */
function balance(content: string, face: Face, lines: number): string[] {
  const words = content.split(" ");
  if (lines <= 1 || words.length <= lines) {
    return lines <= 1 ? [content] : words;
  }
  let best: { rows: string[]; widest: number } | null = null;
  const walk = (start: number, rows: string[]) => {
    const remaining = lines - rows.length;
    if (remaining === 1) {
      const all = [...rows, words.slice(start).join(" ")];
      const widest = Math.max(...all.map((row) => measure(row, face).width));
      if (!best || widest < best.widest) best = { rows: all, widest };
      return;
    }
    for (let end = start + 1; end <= words.length - (remaining - 1); end += 1) {
      walk(end, [...rows, words.slice(start, end).join(" ")]);
    }
  };
  walk(0, []);
  return (best as { rows: string[] } | null)?.rows ?? [content];
}

/** True when every line but the last ends a clause: the reader's breaks, not the frame's. */
const breaksAtClauses = (rows: string[]) =>
  rows.slice(0, -1).every((row) => /[,;:.?!]$/.test(row));

/**
 * The question, set as large as the box allows: tries one, two and three lines,
 * each balanced, and keeps the count that gives the largest type. A setting
 * that breaks only where the sentence does wins over a larger one that does
 * not, down to 70% of that size: "wrong, does / anyone" reads worse than the
 * same question a size smaller.
 */
function fitQuestion(maxWidth: number, maxHeight: number, maxSize: number) {
  const LEADING = 1.14;
  const settings = [1, 2, 3].map((count) => {
    const rows = balance(QUESTION, SERIF, count);
    const widest = Math.max(...rows.map((row) => measure(row, SERIF).width));
    const size = Math.floor(
      Math.min(maxSize, maxWidth / widest, maxHeight / (count * LEADING)),
    );
    return { size, rows };
  });
  const largest = settings.reduce((a, b) => (b.size > a.size ? b : a));
  const atClauses = settings
    .filter(
      (setting) =>
        breaksAtClauses(setting.rows) && setting.size >= largest.size * 0.7,
    )
    .reduce<(typeof settings)[number] | null>(
      (a, b) => (!a || b.size > a.size ? b : a),
      null,
    );
  const best = atClauses ?? largest;
  return { ...best, leading: best.size * LEADING };
}

/* -------------------------------------------------------------------------- */
/* Layouts                                                                    */
/* -------------------------------------------------------------------------- */

/** The favicon: the mark on its tile, filling the frame. `rx` 0 is the home-screen icon. */
const iconScene = (size: number, rx: number) =>
  svgDocument(
    size,
    size,
    "Ethotechnics",
    tile(0, 0, size, SAPPHIRE, PAPER, rx),
  );

/** A placeholder a few pixels across: the ground, the card's top rule and the tile. */
function placeholderScene(width: number, height: number, g: Ground) {
  const size = height * 0.6;
  return svgDocument(
    width,
    height,
    "Ethotechnics",
    `<rect width="${width}" height="${height}" fill="${g.ground}"/>
  <rect width="${width}" height="${Math.max(1, Math.round(height * 0.04))}" fill="${g.accent}"/>
  ${tile((width - size) / 2, (height - size) / 2, size, g.tile, g.tileInk)}`,
  );
}

/** The tile beside the wordmark, centred in the frame: the header's lockup. */
function rowScene(width: number, height: number, g: Ground) {
  const main = measure(WORDMARK, SERIF, WORDMARK_TRACKING);
  // Tile, a gap of a third of the tile, then the wordmark; sized so the row
  // takes 82% of the frame's width or 62% of its height, whichever binds.
  const TILE_TO_TYPE = 2.1;
  const GAP = 0.34;
  const byWidth = (width * 0.82) / (TILE_TO_TYPE * (1 + GAP) + main.width);
  const byHeight = (height * 0.62) / TILE_TO_TYPE;
  const size = Math.min(byWidth, byHeight);
  const tileSize = size * TILE_TO_TYPE;
  const rowWidth = tileSize * (1 + GAP) + main.width * size;
  const left = (width - rowWidth) / 2;
  const typeHeight = wordmarkHeight(size);
  const mark = wordmark(
    left + tileSize * (1 + GAP) + (main.width * size) / 2,
    (height - typeHeight) / 2,
    size,
    g,
  );
  return svgDocument(
    width,
    height,
    "Ethotechnics Institute",
    `<rect width="${width}" height="${height}" fill="${g.ground}"/>
  ${tile(left, (height - tileSize) / 2, tileSize, g.tile, g.tileInk)}
  ${mark.body}`,
  );
}

/**
 * The tile over the wordmark, centred. In a frame with room for it the kicker
 * sits under a short rule, where the old lockup carried its tagline; `safe`
 * keeps the block inside a circular crop and leaves the kicker out.
 */
function stackScene(
  width: number,
  height: number,
  g: Ground,
  options: { safe?: boolean; bleed?: boolean } = {},
) {
  const main = measure(WORDMARK, SERIF, WORDMARK_TRACKING);
  const kicker = measure(KICKER, SANS_BOLD);
  /* Per unit of wordmark size: the tile, the gap under it, and the kicker's block. */
  const TILE = 3.1;
  const GAP = 0.95;
  const KICKER_SIZE = 0.44;
  const KICKER_BLOCK = 0.9 + KICKER_SIZE * 1.9;

  const blockHeight = (size: number, withKicker: boolean) =>
    size * (TILE + GAP) +
    wordmarkHeight(size) +
    (withKicker ? size * KICKER_BLOCK : 0);
  /** The largest wordmark size whose block fits the frame's width and height. */
  const fit = (withKicker: boolean) => {
    const byWidth = (width * (options.safe ? 0.62 : 0.72)) / main.width;
    const byHeight =
      (height * (options.safe ? 0.6 : 0.68)) /
      (blockHeight(100, withKicker) / 100);
    return Math.min(byWidth, byHeight);
  };

  /* The kicker is worth its room only where it can be read: 15px or more, inside the margins. */
  const withKickerSize = fit(true);
  const kickerSize = Math.min(
    withKickerSize * KICKER_SIZE,
    (width * 0.84) / kicker.width,
  );
  const hasKicker = !options.safe && kickerSize >= 15;
  const size = hasKicker ? withKickerSize : fit(false);

  const tileSize = size * TILE;
  const top = (height - blockHeight(size, hasKicker)) / 2;
  const cx = width / 2;
  const mark = wordmark(cx, top + tileSize + size * GAP, size, g);
  let body = `<rect width="${width}" height="${height}" fill="${g.ground}"/>
  ${options.bleed ? watermark(width, height, g) : ""}
  ${tile(cx - tileSize / 2, top, tileSize, g.tile, g.tileInk)}
  ${mark.body}`;
  if (hasKicker) {
    const ruleY = mark.bottom + size * 0.9;
    const ruleHalf = size * 1.6;
    body += `
  <line x1="${(cx - ruleHalf).toFixed(2)}" y1="${ruleY.toFixed(2)}" x2="${(cx + ruleHalf).toFixed(2)}" y2="${ruleY.toFixed(2)}" stroke="${g.ink}" stroke-opacity="0.24" stroke-width="${Math.max(1, size * 0.03).toFixed(2)}"/>
  ${text(KICKER, SANS_BOLD, kickerSize, cx, ruleY + size * KICKER_SIZE * 1.9, g.accent, { anchor: "middle" })}`;
  }
  return svgDocument(width, height, "Ethotechnics Institute", body);
}

/**
 * The home share card's layout at this frame's size: the top rule, the brand
 * row, the question, then the kicker and the address under a rule.
 */
function cardScene(width: number, height: number, g: Ground) {
  // The share card is 1200×630 with an 80px margin; every length scales from it.
  const k = Math.min(width / 1200, height / 630);
  const margin = 80 * k;
  const right = width - margin;
  const tileSize = 40 * k;
  const brandTop = 64 * k;
  const brandSize = 20 * k;
  const brandBaseline = brandTop + 28 * k;
  const brand = measure(WORDMARK, SANS_BOLD, BRAND_TRACKING);
  const brandLeft = margin + 56 * k;
  const barX = brandLeft + brand.width * brandSize + 16 * k;

  const ruleY = height - 118 * k;
  const footBaseline = height - 74 * k;
  const footSize = 22 * k;

  const bandTop = brandTop + tileSize + 36 * k;
  const bandBottom = ruleY - 36 * k;
  const question = fitQuestion(right - margin, bandBottom - bandTop, 82 * k);
  const cap = -measure("W", SERIF).top * question.size;
  const blockHeight = cap + (question.rows.length - 1) * question.leading;
  const firstBaseline =
    bandTop + (bandBottom - bandTop - blockHeight) / 2 + cap;

  return svgDocument(
    width,
    height,
    `${QUESTION} — Ethotechnics`,
    `<rect width="${width}" height="${height}" fill="${g.ground}"/>
  ${watermark(width, height, g)}
  <rect width="${width}" height="${(10 * k).toFixed(2)}" fill="${g.accent}"/>
  ${tile(margin, brandTop, tileSize, g.tile, g.tileInk)}
  ${text(WORDMARK, SANS_BOLD, brandSize, brandLeft, brandBaseline, g.muted, { tracking: BRAND_TRACKING })}
  <rect x="${barX.toFixed(2)}" y="${(brandTop + 10 * k).toFixed(2)}" width="${(2 * k).toFixed(2)}" height="${(22 * k).toFixed(2)}" fill="${g.muted}" opacity="0.45"/>
  ${text(WORDMARK_SUB, SANS_BOLD, brandSize, barX + 18 * k, brandBaseline, g.accent, { tracking: BRAND_TRACKING })}
  ${question.rows
    .map((row, index) =>
      text(
        row,
        SERIF,
        question.size,
        margin,
        firstBaseline + index * question.leading,
        g.ink,
      ),
    )
    .join("\n  ")}
  <line x1="${margin.toFixed(2)}" y1="${ruleY.toFixed(2)}" x2="${right.toFixed(2)}" y2="${ruleY.toFixed(2)}" stroke="${g.ink}" stroke-opacity="0.14" stroke-width="${(2 * k).toFixed(2)}"/>
  ${text(KICKER, SANS_BOLD, footSize, margin, footBaseline, g.accent)}
  ${text(PROJECT, SANS, footSize, right, footBaseline, g.muted, { anchor: "end" })}`,
  );
}

/**
 * A wide strip: the lockup at the left, a rule, then the question and the
 * kicker. The card's layout scaled to a 1920×400 strip sets its text at 14px.
 */
function bannerScene(width: number, height: number, g: Ground) {
  const margin = width * 0.0625;
  const main = measure(WORDMARK, SERIF, WORDMARK_TRACKING);
  const size = height * 0.135;
  const tileSize = size * 2.3;
  const gap = tileSize * 0.3;
  const lockupWidth = tileSize + gap + main.width * size;
  const typeHeight = wordmarkHeight(size);
  const mark = wordmark(
    margin + tileSize + gap + (main.width * size) / 2,
    (height - typeHeight) / 2,
    size,
    g,
  );
  const dividerX = margin + lockupWidth + width * 0.035;
  const textLeft = dividerX + width * 0.035;
  const right = width - margin;

  const kickerSize = height * 0.062;
  const kickerGap = kickerSize * 1.5;
  const question = fitQuestion(
    right - textLeft,
    height * 0.62 - kickerGap - kickerSize,
    height * 0.16,
  );
  const cap = -measure("W", SERIF).top * question.size;
  const blockHeight =
    cap +
    (question.rows.length - 1) * question.leading +
    kickerGap +
    kickerSize * 0.7;
  const firstBaseline = (height - blockHeight) / 2 + cap;
  const kickerBaseline =
    firstBaseline +
    (question.rows.length - 1) * question.leading +
    kickerGap +
    kickerSize * 0.7;

  return svgDocument(
    width,
    height,
    `${QUESTION} — Ethotechnics`,
    `<rect width="${width}" height="${height}" fill="${g.ground}"/>
  ${watermark(width, height, g)}
  <rect width="${width}" height="${Math.round(height * 0.02)}" fill="${g.accent}"/>
  ${tile(margin, (height - tileSize) / 2, tileSize, g.tile, g.tileInk)}
  ${mark.body}
  <line x1="${dividerX.toFixed(2)}" y1="${(height * 0.26).toFixed(2)}" x2="${dividerX.toFixed(2)}" y2="${(height * 0.76).toFixed(2)}" stroke="${g.ink}" stroke-opacity="0.18" stroke-width="2"/>
  ${question.rows
    .map((row, index) =>
      text(
        row,
        SERIF,
        question.size,
        textLeft,
        firstBaseline + index * question.leading,
        g.ink,
      ),
    )
    .join("\n  ")}
  ${text(KICKER, SANS_BOLD, kickerSize, textLeft, kickerBaseline, g.accent)}`,
  );
}

/* -------------------------------------------------------------------------- */
/* Scenes                                                                     */
/* -------------------------------------------------------------------------- */

type Scene = { width: number; height: number; draw: () => string };

const scene = (
  width: number,
  height: number,
  draw: (width: number, height: number) => string,
): Scene => ({ width, height, draw: () => draw(width, height) });

/** Keyed by the file's suffix: docs/assets/ethotechnics.org-<key>.png. */
const SCENES: Record<string, Scene> = {
  badge: scene(240, 96, (w, h) => rowScene(w, h, LIGHT)),
  blur: scene(50, 28, (w, h) => placeholderScene(w, h, LIGHT)),
  card: scene(400, 300, (w, h) => stackScene(w, h, LIGHT)),
  circle: scene(540, 540, (w, h) => stackScene(w, h, LIGHT, { safe: true })),
  dark: scene(960, 540, (w, h) => stackScene(w, h, DARK, { bleed: true })),
  "dark-og": scene(960, 540, (w, h) => cardScene(w, h, DARK)),
  email: scene(600, 200, (w, h) => rowScene(w, h, LIGHT)),
  favicon: scene(64, 64, (w) => iconScene(w, 7)),
  github: scene(1280, 640, (w, h) => cardScene(w, h, LIGHT)),
  header: scene(1920, 400, (w, h) => bannerScene(w, h, LIGHT)),
  mastodon: scene(1200, 600, (w, h) => cardScene(w, h, DEEP)),
  og: scene(1200, 675, (w, h) => cardScene(w, h, LIGHT)),
  square: scene(1080, 1080, (w, h) => stackScene(w, h, LIGHT, { bleed: true })),
  touch: scene(360, 360, (w, h) => stackScene(w, h, LIGHT)),
  "touch-icon": scene(360, 360, (w) => iconScene(w, 0)),
  unfurl: scene(1200, 628, (w, h) => cardScene(w, h, LIGHT)),
};

/**
 * source.svg: the stacked lockup on paper. It names the share cards' serif
 * first and then the site's own stack, so it reads the same in a browser that
 * has neither installed.
 */
function sourceSvg(): string {
  const serif =
    "'Source Serif 4', 'Iowan Old Style', 'Palatino Linotype', Palatino, Charter, Georgia, serif";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-labelledby="source-title">
  <title id="source-title">Ethotechnics Institute</title>
  <!--
    Written by scripts/generate-scenes.ts (bun run assets:generate): the
    stacked lockup the kit's square scenes draw. The mark on its tile matches
    public/favicon.svg; the two lines are the header's wordmark
    (src/components/SvgDefs.astro).
  -->
  <rect width="400" height="300" fill="${PAPER}"/>
  <g transform="translate(160 62) scale(2.5)">
    <rect width="32" height="32" rx="7" fill="${SAPPHIRE}"/>
    <g fill="none" stroke="${PAPER}" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="${MARK_HALF}"/>
      <path d="${MARK_HALF}" transform="rotate(180 16 16)"/>
    </g>
  </g>
  <text x="200" y="196" text-anchor="middle" fill="${INK}" font-family="${serif}" font-size="30" font-weight="600" letter-spacing="2.4">${WORDMARK}</text>
  <text x="200" y="221" text-anchor="middle" fill="${INK}" opacity="0.78" font-family="${serif}" font-size="13.6" font-weight="600" letter-spacing="5.4">${WORDMARK_SUB}</text>
</svg>
`;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  await loadRenderer();

  for (const [name, spec] of Object.entries(SCENES)) {
    const file = `${PROJECT}-${name}.png`;
    const png = renderer(spec.draw(), spec.width).render().asPng();
    if (dryRun) {
      console.log(
        `  [dry] ${file}  ${spec.width}×${spec.height}  ${png.length.toLocaleString()}B`,
      );
      continue;
    }
    writeFileSync(join(ASSETS_DIR, file), png);
    console.log(
      `  ${file}  ${spec.width}×${spec.height}  ${png.length.toLocaleString()}B`,
    );
  }

  if (!dryRun) {
    writeFileSync(join(ASSETS_DIR, "source.svg"), sourceSvg());
    console.log("  source.svg");
  }
  console.log(
    `\n${dryRun ? "DRY RUN: nothing written. " : ""}${Object.keys(SCENES).length} scenes; question: “${QUESTION}”`,
  );
}

await main();
