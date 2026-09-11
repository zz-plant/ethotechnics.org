#!/usr/bin/env bun
/* eslint-disable no-console */
/**
 * generate-icons.ts — renders the Ethotechnics section mark into the full
 * favicon set under public/.
 *
 * The mark is a section sign (§), the typographic symbol for a numbered clause,
 * drawn as an even-weight stroke rather than lifted from a text face: the site's
 * serif has too much thick/thin contrast to survive a 16px favicon. Colours are
 * the theme.css tokens, so the icons cannot drift from the palette again.
 *
 * Usage: bun run scripts/generate-icons.ts [--check]
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DIR = join(process.cwd(), "public");
const WASM_PATH = join(
  process.cwd(),
  "node_modules",
  "@resvg",
  "resvg-wasm",
  "index_bg.wasm",
);

/** theme.css tokens. Light: --accent / --bg. Dark: --text / a lifted --accent. */
const PAPER = "#faf8f5";
const SAPPHIRE = "#1e3a5f";
const PAPER_DARK = "#f4f1ea";
/** --accent lifted toward --panel so the tile keeps its edge on dark browser chrome. */
const SAPPHIRE_LIFT = "#27496f";

/**
 * Half of the section mark, from the upper terminal through the crossing stem.
 * The glyph is symmetric under a 180° rotation about its centre, so the second
 * half is the same path rotated — which also guarantees the two stems stay
 * parallel and the crossing reads as a § rather than an S.
 */
const MARK_HALF =
  "M20.93 10.02 C20.93 7.38 18.29 5.79 15.38 6.41 " +
  "C12.22 7.11 11.07 10.28 13.36 12.22 L18.64 17.41";

const STROKE = 3.8;

type MarkOptions = {
  /** Tile fill, or null for a transparent background. */
  bg: string | null;
  /** Stroke colour of the mark itself. */
  fg: string;
  /** Corner radius in viewBox units. Apple and maskable icons want 0. */
  rx?: number;
  /** Scales the mark about the tile centre; < 1 buys maskable safe-zone room. */
  scale?: number;
};

function markSvg({ bg, fg, rx = 7, scale = 1 }: MarkOptions): string {
  const tile = bg
    ? `\n  <rect width="32" height="32" rx="${rx}" fill="${bg}"/>`
    : "";
  // Scale about the centre and divide the stroke back out, so the mark shrinks
  // inside the tile without also going lighter.
  const group =
    scale === 1
      ? ""
      : ` transform="translate(16 16) scale(${scale}) translate(-16 -16)"`;
  const width = (STROKE / scale).toFixed(3);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${tile}
  <g${group} fill="none" stroke="${fg}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${MARK_HALF}"/>
    <path d="${MARK_HALF}" transform="rotate(180 16 16)"/>
  </g>
</svg>
`;
}

/** The mark on its light tile — the canonical brand asset. */
const FAVICON_LIGHT = markSvg({ bg: SAPPHIRE, fg: PAPER });
/** Swapped for dark browser chrome via the prefers-color-scheme icon link. */
const FAVICON_DARK = markSvg({ bg: SAPPHIRE_LIFT, fg: PAPER_DARK });
/** iOS masks the corners itself, so ship a square, fully opaque tile. */
const APPLE = markSvg({ bg: SAPPHIRE, fg: PAPER, rx: 0 });
/** Android crops maskable icons to an arbitrary shape; keep the mark in the safe zone. */
const MASKABLE = markSvg({ bg: SAPPHIRE, fg: PAPER, rx: 0, scale: 0.62 });

type PngTarget = { file: string; size: number; svg: string };

const PNG_TARGETS: PngTarget[] = [
  { file: "favicon-16.png", size: 16, svg: FAVICON_LIGHT },
  { file: "favicon-32.png", size: 32, svg: FAVICON_LIGHT },
  { file: "apple-touch-icon.png", size: 180, svg: APPLE },
  { file: "icon-192.png", size: 192, svg: FAVICON_LIGHT },
  { file: "icon-512.png", size: 512, svg: FAVICON_LIGHT },
  { file: "icon-maskable-512.png", size: 512, svg: MASKABLE },
];

const SVG_TARGETS: Array<{ file: string; svg: string }> = [
  { file: "favicon.svg", svg: FAVICON_LIGHT },
  { file: "favicon-dark.svg", svg: FAVICON_DARK },
];

/** favicon.ico carries these; 48 is what Windows taskbar pins actually use. */
const ICO_SIZES = [16, 32, 48];

let resvgReady: Promise<typeof import("@resvg/resvg-wasm")> | null = null;

async function loadResvg() {
  if (!resvgReady) {
    resvgReady = (async () => {
      const mod = await import("@resvg/resvg-wasm");
      await mod.initWasm(readFileSync(WASM_PATH));
      return mod;
    })();
  }
  return resvgReady;
}

async function renderPng(svg: string, size: number): Promise<Uint8Array> {
  const { Resvg } = await loadResvg();
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
  });
  return resvg.render().asPng();
}

/**
 * Builds a PNG-payload ICO by hand. Every browser and Windows version still in
 * service reads PNG-in-ICO, and this avoids adding an encoder dependency for
 * one file that changes about once a decade.
 */
function buildIco(pngs: Array<{ size: number; data: Uint8Array }>): Uint8Array {
  const HEADER = 6;
  const ENTRY = 16;
  const dirSize = HEADER + ENTRY * pngs.length;
  const total = pngs.reduce((sum, png) => sum + png.data.length, dirSize);

  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, pngs.length, true);

  let offset = dirSize;
  pngs.forEach((png, index) => {
    const entry = HEADER + ENTRY * index;
    out[entry] = png.size >= 256 ? 0 : png.size; // 0 means 256
    out[entry + 1] = png.size >= 256 ? 0 : png.size;
    out[entry + 2] = 0; // palette size
    out[entry + 3] = 0; // reserved
    view.setUint16(entry + 4, 1, true); // colour planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, png.data.length, true);
    view.setUint32(entry + 12, offset, true);
    out.set(png.data, offset);
    offset += png.data.length;
  });

  return out;
}

function equals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  return a.every((byte, index) => byte === b[index]);
}

async function main() {
  const check = process.argv.includes("--check");
  const encoder = new TextEncoder();
  const stale: string[] = [];

  const write = (file: string, data: Uint8Array) => {
    const path = join(PUBLIC_DIR, file);
    if (check) {
      const current = existsSync(path)
        ? new Uint8Array(readFileSync(path))
        : new Uint8Array();
      if (!equals(current, data)) stale.push(file);
      return;
    }
    writeFileSync(path, data);
    console.log(`  ${file} (${data.length} bytes)`);
  };

  if (!check) console.log("Generating icons into public/");

  for (const { file, svg } of SVG_TARGETS) {
    write(file, encoder.encode(svg));
  }

  for (const { file, size, svg } of PNG_TARGETS) {
    write(file, await renderPng(svg, size));
  }

  const icoParts = await Promise.all(
    ICO_SIZES.map(async (size) => ({
      size,
      data: await renderPng(FAVICON_LIGHT, size),
    })),
  );
  write("favicon.ico", buildIco(icoParts));

  if (check && stale.length > 0) {
    console.error(
      `Icons are out of date with scripts/generate-icons.ts:\n` +
        stale.map((file) => `  - public/${file}`).join("\n") +
        `\nRun: bun run icons:generate`,
    );
    process.exit(1);
  }
}

await main();
