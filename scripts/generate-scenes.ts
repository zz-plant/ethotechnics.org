#!/usr/bin/env bun
/* eslint-disable no-console, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, no-empty */
/**
 * generate-scenes.ts — renders source.svg into scene-specific PNGs with variation.
 * Usage: bun run scripts/generate-scenes.ts [--dry-run]
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
} from "node:fs";
import { join, basename } from "node:path";
import { execSync } from "node:child_process";

const ASSETS_DIR = join(process.cwd(), "docs", "assets");
const SVG_PATH = join(ASSETS_DIR, "source.svg");
const PROJECT = basename(process.cwd());

/** Warm paper and sapphire, from src/styles/theme.css. */
const PAPER = "#faf8f5";
const PANEL = "#f3efe8";
const INK = "#1c1917";
const SAPPHIRE = "#1e3a5f";
const OBSIDIAN = "#18181b";

type SceneSpec = {
  width: number;
  height: number;
  minBytes: number;
  /** Scene background. */
  bg: string;
  /** Colour the lockup inherits; source.svg is drawn entirely in currentColor. */
  ink: string;
  gradient?: boolean;
  /** Fraction of the shorter scene axis the lockup should occupy. */
  scale?: number;
};

const light = (
  width: number,
  height: number,
  minBytes: number,
  scale?: number,
): SceneSpec => ({
  width,
  height,
  minBytes,
  bg: PAPER,
  ink: SAPPHIRE,
  scale,
});

const SCENES: Record<string, SceneSpec> = {
  badge: { ...light(240, 96, 900), bg: PANEL, scale: 0.82 },
  blur: { ...light(50, 28, 120), scale: 0.8 },
  card: light(400, 300, 2_400),
  circle: { ...light(540, 540, 5_000), gradient: true, scale: 0.62 },
  dark: {
    width: 960,
    height: 540,
    minBytes: 6_000,
    bg: OBSIDIAN,
    ink: PAPER,
    gradient: true,
    scale: 0.5,
  },
  demo: { ...light(720, 405, 4_000), gradient: true, scale: 0.6 },
  email: { ...light(600, 200, 2_200), bg: PANEL, scale: 0.7 },
  favicon: { ...light(64, 64, 250), scale: 0.9 },
  github: { ...light(1280, 640, 9_000), gradient: true, scale: 0.5 },
  header: { ...light(1920, 400, 8_000), bg: PANEL, scale: 0.55 },
  mastodon: {
    width: 1200,
    height: 600,
    minBytes: 8_000,
    bg: SAPPHIRE,
    ink: PAPER,
    gradient: true,
    scale: 0.52,
  },
  og: { ...light(1200, 675, 9_000), gradient: true, scale: 0.55 },
  square: { ...light(1080, 1080, 12_000), gradient: true, scale: 0.6 },
  touch: { ...light(360, 360, 2_500), scale: 0.72 },
  unfurl: { ...light(1200, 628, 9_000), gradient: true, scale: 0.55 },
};

/** source.svg's own coordinate system, used to place and scale the lockup. */
const SOURCE_WIDTH = 400;
const SOURCE_HEIGHT = 200;

function buildBackground(spec: SceneSpec): string {
  const { width, height, gradient, bg, ink } = spec;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
  svg += `<rect width="100%" height="100%" fill="${bg}"/>`;

  if (gradient) {
    svg += `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${ink}" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="${ink}" stop-opacity="0"/>
    </linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>`;
  }

  return svg;
}

/** Wordmark scenes are too small to also carry a legible URL. */
const MIN_URL_WIDTH = 400;

function buildFooter(spec: SceneSpec): string {
  if (spec.width < MIN_URL_WIDTH) return "";
  const size = Math.max(11, Math.min(spec.width, spec.height) * 0.022);
  return `<text x="${spec.width - size * 1.4}" y="${spec.height - size * 1.1}" font-family="system-ui,sans-serif" font-size="${size}" fill="${spec.ink}" fill-opacity="0.34" text-anchor="end">${PROJECT}</text>`;
}

function main() {
  const dryRun = process.argv.includes("--dry-run");

  if (!existsSync(SVG_PATH)) {
    console.error(`❌ No source.svg at ${SVG_PATH}`);
    process.exit(1);
  }

  const svgRaw = readFileSync(SVG_PATH, "utf-8");
  const innerMatch = svgRaw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  const innerSvg = innerMatch ? innerMatch[1] : svgRaw; // Inner content only, no wrapper <svg>

  mkdirSync(ASSETS_DIR, { recursive: true });

  let ok = 0,
    warn = 0,
    err = 0;

  for (const [scene, spec] of Object.entries(SCENES)) {
    const outPath = join(ASSETS_DIR, `${PROJECT}-${scene}.png`);
    const compPath = join(ASSETS_DIR, `_${scene}_comp.svg`);

    if (dryRun) {
      console.log(`  [dry] ${scene}: ${spec.width}×${spec.height} ${spec.bg}`);
      continue;
    }

    try {
      // Fit the lockup to the scene on its tightest axis, then centre it. The
      // old code scaled by the scene's own dimensions, which left the lockup
      // stranded in a corner on any scene that was not roughly 400×200.
      const fraction = spec.scale ?? 0.7;
      const scale =
        Math.min(spec.width / SOURCE_WIDTH, spec.height / SOURCE_HEIGHT) *
        fraction;
      const sx = (spec.width - SOURCE_WIDTH * scale) / 2;
      const sy = (spec.height - SOURCE_HEIGHT * scale) / 2;

      const composed =
        buildBackground(spec) +
        `\n  <g color="${spec.ink}" transform="translate(${sx.toFixed(2)} ${sy.toFixed(2)}) scale(${scale.toFixed(4)})">${innerSvg}</g>\n` +
        buildFooter(spec) +
        `\n</svg>`;
      writeFileSync(compPath, composed);

      execSync(
        `rsvg-convert -w ${spec.width} -h ${spec.height} -o "${outPath}" "${compPath}"`,
        { stdio: "pipe", timeout: 10000 },
      );

      const sz = statSync(outPath).size;
      if (sz < spec.minBytes) {
        console.log(`  ⚠️  ${scene}: ${sz}B (below ${spec.minBytes}B)`);
        warn++;
      } else {
        ok++;
      }
    } catch (e: any) {
      console.error(`  ❌ ${scene}: ${e.stderr || e.message}`);
      err++;
    } finally {
      try {
        execSync(`rm -f "${compPath}"`);
      } catch {}
    }
  }

  console.log(`\n${dryRun ? "DRY RUN " : ""}✅ ${ok}  ⚠️ ${warn}  ❌ ${err}`);
  if (err > 0) process.exit(1);
}

main();
