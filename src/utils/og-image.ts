import resvgWasmModule from "@resvg/resvg-wasm/index_bg.wasm";
import serifSemiboldUrl from "../assets/fonts/source-serif-4-semibold-latin.ttf?url";
import sansRegularUrl from "../assets/fonts/source-sans-3-regular-latin.ttf?url";
import sansSemiboldUrl from "../assets/fonts/source-sans-3-semibold-latin.ttf?url";
import { createHash } from "node:crypto";
import {
  OG_TEMPLATES,
  resolveOgTemplate,
  type OgTemplate,
} from "./seo/og-template";

const DEFAULT_TITLE = "Ethotechnics Institute";
const DEFAULT_DESCRIPTION =
  "Standards, mechanisms, and validators for accountable system governance.";
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Every card is warm paper and one accent drawn from theme.css. Templates are
 * separated by their label and accent family, not by a different hue each —
 * a standards publisher whose sections are colour-coded in rainbow reads as a
 * marketing site, and the old palette here was stock Tailwind besides.
 */
const PAPER = "#faf8f5";
const SURFACE = "#ffffff";
const BORDER = "#e6e2da";
const INK = "#1c1917";
const MUTED = "#57534e";
const SAPPHIRE = "#1e3a5f";
const TEAL = "#2e5266";
const GOLD = "#b45309";

// Single-quoted family names: these are interpolated into double-quoted XML
// attributes, where a nested double quote ends the attribute early.
const OG_SERIF =
  "'Source Serif 4', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";
const OG_SANS =
  "'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

type TemplateStyle = {
  label: string;
  kicker: string;
  accent: string;
};

const templateStyles: Record<OgTemplate, TemplateStyle> = {
  default: {
    label: "Reference",
    kicker: "Accountable systems, made legible",
    accent: SAPPHIRE,
  },
  home: {
    label: "Institute",
    kicker: "The reference standard for accountable systems",
    accent: SAPPHIRE,
  },
  standards: {
    label: "Standards",
    kicker: "Public technical standards for governance",
    accent: SAPPHIRE,
  },
  glossary: {
    label: "Glossary",
    kicker: "Operational language for ethical technology",
    accent: TEAL,
  },
  taxonomy: {
    label: "Taxonomy",
    kicker: "Design and governance domains in context",
    accent: TEAL,
  },
  mechanisms: {
    label: "Mechanisms",
    kicker: "Implementation patterns and reusable primitives",
    accent: SAPPHIRE,
  },
  editorial: {
    label: "Editorial",
    kicker: "Research, incidents, and field notes",
    accent: GOLD,
  },
};

const MAX_TITLE_CHARS = 98;
const MAX_DESCRIPTION_CHARS = 185;
const MAX_TEMPLATE_CHARS = 32;
const MAX_PATH_CHARS = 240;

type OgRequestInput = {
  title: string;
  description: string;
  template?: string;
  path?: string;
};

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const trimToLength = (value: string, maxLength: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};

const normalizeOptionalParam = (
  value: string | null | undefined,
  max: number,
) => {
  if (!value) return undefined;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return undefined;
  return normalized.slice(0, max);
};

const normalizeOgRequestInput = (input: Partial<OgRequestInput>) => ({
  title: trimToLength(input.title ?? DEFAULT_TITLE, MAX_TITLE_CHARS),
  description: trimToLength(
    input.description ?? DEFAULT_DESCRIPTION,
    MAX_DESCRIPTION_CHARS,
  ),
  template: normalizeOptionalParam(input.template, MAX_TEMPLATE_CHARS),
  path: normalizeOptionalParam(input.path, MAX_PATH_CHARS),
});

const buildOgEtag = (input: Partial<OgRequestInput>) => {
  const normalized = normalizeOgRequestInput(input);
  const digest = createHash("sha256")
    .update(JSON.stringify(normalized))
    .digest("hex");
  return `"${digest}"`;
};

const isIfNoneMatchSatisfied = (ifNoneMatch: string | null, etag: string) => {
  if (!ifNoneMatch) return false;
  const normalizeTag = (value: string) => value.trim().replace(/^W\//, "");
  const normalizedEtag = normalizeTag(etag);

  return ifNoneMatch.split(",").some((token) => {
    const candidate = token.trim();
    if (candidate === "*") return true;
    return normalizeTag(candidate) === normalizedEtag;
  });
};

/**
 * Per-character advance estimates as a fraction of font size. SVG has no text
 * layout, so lines have to be broken here; measuring properly would mean
 * parsing font metrics for a job where being a few percent out just leaves a
 * slightly short line.
 */
const NARROW = new Set([..."iljtIfr.,;:'!|()[]-"]);
const WIDE = new Set([..."mwMW@%"]);

const estimateTextWidth = (text: string, fontSize: number) => {
  let units = 0;
  for (const character of text) {
    if (NARROW.has(character)) units += 0.31;
    else if (WIDE.has(character)) units += 0.92;
    else if (character === " ") units += 0.26;
    else if (character >= "A" && character <= "Z") units += 0.68;
    else units += 0.52;
  }
  return units * fontSize;
};

/** Greedy wrap; anything past maxLines is folded back with an ellipsis. */
const wrapText = (
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

const PANEL = {
  x: 48,
  y: 48,
  width: WIDTH - 96,
  height: HEIGHT - 96,
  radius: 20,
};
const CONTENT_LEFT = 104;
const CONTENT_RIGHT = WIDTH - 96;
const CONTENT_WIDTH = CONTENT_RIGHT - CONTENT_LEFT;

const TITLE_SIZE = 58;
const TITLE_LEADING = 66;
const DESCRIPTION_SIZE = 26;
const DESCRIPTION_LEADING = 37;

/**
 * The section mark from public/favicon.svg, scaled from its 32-unit tile.
 * Kept in sync by eye rather than by import: this file has to run inside a
 * Worker, where reading the SVG off disk is not an option.
 */
const MARK_HALF =
  "M20.93 10.02 C20.93 7.38 18.29 5.79 15.38 6.41 " +
  "C12.22 7.11 11.07 10.28 13.36 12.22 L18.64 17.41";

const buildOgSvg = (
  title: string,
  description: string,
  options?: { template?: string; path?: string },
) => {
  const ogTemplate = resolveOgTemplate(options?.template, options?.path);
  const style = templateStyles[ogTemplate];
  const safeTitle = trimToLength(title, MAX_TITLE_CHARS);
  const safeDescription = trimToLength(description, MAX_DESCRIPTION_CHARS);

  const titleLines = wrapText(safeTitle, CONTENT_WIDTH, TITLE_SIZE, 3);
  const descriptionLines = wrapText(
    safeDescription,
    CONTENT_WIDTH - 60,
    DESCRIPTION_SIZE,
    2,
  );

  // Centre the text block in the band between the header row and the rule, so
  // a one-line title does not leave a hole above the footer and a three-line
  // one does not crowd it.
  const BAND_TOP = 168;
  const BAND_BOTTOM = 470;
  const blockHeight =
    titleLines.length * TITLE_LEADING +
    (descriptionLines.length > 0
      ? 26 + descriptionLines.length * DESCRIPTION_LEADING
      : 0);
  const titleTop = Math.round(
    BAND_TOP + (BAND_BOTTOM - BAND_TOP - blockHeight) / 2 + TITLE_SIZE * 0.74,
  );
  const titleSpans = titleLines
    .map(
      (line, index) =>
        `<tspan x="${CONTENT_LEFT}" y="${titleTop + index * TITLE_LEADING}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const descriptionTop = titleTop + titleLines.length * TITLE_LEADING + 26;
  const descriptionSpans = descriptionLines
    .map(
      (line, index) =>
        `<tspan x="${CONTENT_LEFT}" y="${descriptionTop + index * DESCRIPTION_LEADING}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const labelWidth = Math.round(
    estimateTextWidth(style.label.toUpperCase(), 17) + 22 * 2,
  );
  const labelX = CONTENT_RIGHT - labelWidth;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img">
  <title>${escapeXml(safeTitle)} — Ethotechnics Institute</title>
  <defs>
    <clipPath id="panel-clip">
      <rect x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.width}" height="${PANEL.height}" rx="${PANEL.radius}"/>
    </clipPath>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <rect x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.width}" height="${PANEL.height}" rx="${PANEL.radius}" fill="${SURFACE}" stroke="${BORDER}" stroke-width="2"/>
  <g clip-path="url(#panel-clip)">
    <rect x="${PANEL.x}" y="${PANEL.y}" width="12" height="${PANEL.height}" fill="${style.accent}"/>
  </g>
  <g transform="translate(${CONTENT_LEFT} 84) scale(1.375)">
    <rect width="32" height="32" rx="7" fill="${style.accent}"/>
    <g fill="none" stroke="${PAPER}" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="${MARK_HALF}"/>
      <path d="${MARK_HALF}" transform="rotate(180 16 16)"/>
    </g>
  </g>
  <text x="${CONTENT_LEFT + 62}" y="114" font-family="${OG_SANS}" font-size="19" font-weight="600" letter-spacing="3.4" fill="${MUTED}">ETHOTECHNICS INSTITUTE</text>
  <rect x="${labelX}" y="84" width="${labelWidth}" height="42" rx="21" fill="none" stroke="${style.accent}" stroke-width="2"/>
  <text x="${labelX + labelWidth / 2}" y="112" text-anchor="middle" font-family="${OG_SANS}" font-size="17" font-weight="700" letter-spacing="1.6" fill="${style.accent}">${escapeXml(style.label.toUpperCase())}</text>
  <text font-family="${OG_SERIF}" font-size="${TITLE_SIZE}" font-weight="600" fill="${INK}">${titleSpans}</text>
  <text font-family="${OG_SANS}" font-size="${DESCRIPTION_SIZE}" fill="${MUTED}">${descriptionSpans}</text>
  <line x1="${CONTENT_LEFT}" y1="498" x2="${CONTENT_RIGHT}" y2="498" stroke="${BORDER}" stroke-width="2"/>
  <text x="${CONTENT_LEFT}" y="538" font-family="${OG_SANS}" font-size="21" font-weight="600" fill="${style.accent}">${escapeXml(style.kicker)}</text>
  <text x="${CONTENT_RIGHT}" y="538" text-anchor="end" font-family="${OG_SANS}" font-size="21" fill="${MUTED}">ethotechnics.org</text>
</svg>`;
};

const FONT_URLS = [serifSemiboldUrl, sansRegularUrl, sansSemiboldUrl];

/**
 * resvg-wasm has no system fonts to fall back on, so text renders only for
 * families whose buffers are handed to it. Both the wasm and the fonts are
 * fetched from the deployed static assets and memoised per isolate.
 */
let resvgInitPromise: Promise<Uint8Array[]> | null = null;

const initResvg = async (baseUrl: string | URL) => {
  if (!resvgInitPromise) {
    resvgInitPromise = (async () => {
      const [{ initWasm }, ...fontResponses] = await Promise.all([
        import("@resvg/resvg-wasm"),
        ...FONT_URLS.map((url) => fetch(new URL(url, baseUrl).toString())),
      ]);

      // Workers refuse WebAssembly.instantiate() on bytes fetched at runtime,
      // so the module has to arrive as an import the platform compiles ahead of
      // time. Fetching the wasm instead is what made /api/og.png return 500.
      await initWasm(resvgWasmModule);

      return Promise.all(
        fontResponses.map(async (response) =>
          response.ok
            ? new Uint8Array(await response.arrayBuffer())
            : new Uint8Array(),
        ),
      );
    })();
  }

  return (await resvgInitPromise).filter((buffer) => buffer.length > 0);
};

const renderOgPng = async (
  title: string,
  description: string,
  options?: { template?: string; path?: string; baseUrl?: string | URL },
) => {
  const fontBuffers = await initResvg(
    options?.baseUrl ?? "https://ethotechnics.org",
  );
  const { Resvg } = await import("@resvg/resvg-wasm");
  const svg = buildOgSvg(title, description, options);
  const renderer = new Resvg(svg, {
    font: {
      fontBuffers,
      defaultFontFamily: "Source Sans 3",
      serifFamily: "Source Serif 4",
      sansSerifFamily: "Source Sans 3",
    },
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });

  return renderer.render().asPng();
};

export {
  buildOgSvg,
  buildOgEtag,
  renderOgPng,
  normalizeOgRequestInput,
  isIfNoneMatchSatisfied,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  HEIGHT,
  WIDTH,
  OG_TEMPLATES,
  resolveOgTemplate,
};
