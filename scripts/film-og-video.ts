#!/usr/bin/env bun
/**
 * Film the home page's halt chart card as the clip its `og:video` points at.
 *
 *   bun run og:video
 *
 * Writes public/media/og-halt-chart.mp4 (1200x630, H.264, silent) and its record in
 * src/data/og-video.json. Needs ffmpeg and a Chromium Playwright can launch
 * (PLAYWRIGHT_CHROMIUM_PATH is honoured).
 *
 * The clip is the card's own SVG. A day counter runs from zero; every bar grows from the axis at
 * the same rate, so a bar's length at any frame is how long that failure had been running, and
 * each stops, and gets its label, on the day the card says someone stepped in. The longest bar
 * carries the running count until it stops on its own label. Nothing is drawn that the card
 * does not draw. The last frame fades back to the empty axis so a looping player does not jolt.
 *
 * Run it again after any change to the casebook or the card: `src/utils/seo/og-video.ts`
 * withholds the tag while the clip's SVG hash differs from the card's.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import casebook from "../src/data/casebook.json" with { type: "json" };
import { haltChartSvg, svgHash } from "../src/utils/seo/og-video";

const ROOT = path.resolve(import.meta.dir, "..");
const OUT = path.join(ROOT, "public/media/og-halt-chart.mp4");
const RECORD = path.join(ROOT, "src/data/og-video.json");
const FONTS = path.join(ROOT, "src/assets/fonts");
const WIDTH = 1200;
const HEIGHT = 630;
const FPS = 30;

/** Seconds: hold the empty axis, run the longest case, hold the full card, fade back. */
const START = 0.5;
const RUN = 5.5;
const FADE_AT = 8.7;
const FADE = 0.5;
const SECONDS = 9.2;

if (spawnSync("ffmpeg", ["-version"]).status !== 0) {
  console.error("ffmpeg is not installed; nothing filmed");
  process.exit(1);
}

const svg = haltChartSvg();
const longestDays = Math.max(
  ...(casebook.cases as { timeToHaltDays: number }[]).map(
    (c) => c.timeToHaltDays,
  ),
);

const face = (family: string, weight: number, file: string) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-display:block;src:url(data:font/ttf;base64,${Buffer.from(readFileSync(path.join(FONTS, file))).toString("base64")}) format("truetype");}`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${face("Source Sans 3", 400, "source-sans-3-regular-latin.ttf")}
${face("Source Sans 3", 600, "source-sans-3-semibold-latin.ttf")}
${face("Source Serif 4", 600, "source-serif-4-semibold-latin.ttf")}
html,body{margin:0;padding:0;background:#faf8f5}svg{display:block}
</style></head><body>${svg.replace(/^<\?xml[^>]*>\s*/, "")}
<script>
(() => {
  const LONGEST_DAYS = ${longestDays};
  const S0 = ${START}, RUN = ${RUN}, F0 = ${FADE_AT}, F = ${FADE};
  // The bars are the 30px-high rects on the axis; each one's value label is the text after it.
  const bars = [...document.querySelectorAll("rect")].filter((r) => r.getAttribute("height") === "30");
  if (bars.length < 2) throw new Error("not the halt chart");
  const rows = bars.map((r) => {
    const label = r.nextElementSibling;
    return { r, label, x: Number(r.getAttribute("x")), w: Number(r.getAttribute("width")), text: label.textContent, lx: Number(label.getAttribute("x")) };
  });
  const longest = rows.reduce((a, b) => (b.w > a.w ? b : a));
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - (1 - x) ** 3);
  window.renderAt = (t) => {
    const p = Math.min(1, Math.max(0, (t - S0) / RUN)); // share of the longest case elapsed
    const fade = 1 - ease((t - F0) / F);
    for (const row of rows) {
      const w = Math.min(row.w, p * longest.w);
      const done = w >= row.w && p > 0;
      row.r.setAttribute("width", String(w));
      row.r.style.opacity = String(w > 0 ? fade : 0);
      if (row === longest && !done) {
        const years = Math.floor((p * LONGEST_DAYS) / 365);
        row.label.textContent = years >= 1 ? "~" + years + (years === 1 ? " year" : " years") : "";
        row.label.setAttribute("x", String(row.x + w + 16));
        row.label.style.opacity = String(fade);
      } else {
        row.label.textContent = row.text;
        row.label.setAttribute("x", String(row.lx));
        row.label.style.opacity = String(done ? fade : 0);
      }
    }
  };
  window.renderAt(0);
})();
</script></body></html>`;

const { chromium } = await import("@playwright/test");
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {},
);
const frames = mkdtempSync(path.join(tmpdir(), "etho-og-video-"));
try {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const n = Math.round(SECONDS * FPS);
  for (let i = 0; i < n; i++) {
    await page.evaluate(
      (t) =>
        (window as unknown as { renderAt: (t: number) => void }).renderAt(t),
      i / FPS,
    );
    await page.screenshot({
      path: path.join(frames, `f${String(i).padStart(4, "0")}.jpg`),
      type: "jpeg",
      quality: 92,
    });
  }
} finally {
  await browser.close();
}

// Encoded under a temporary .mp4 name and moved into place only when ffmpeg exits 0, so an
// interrupted run cannot leave a short clip that still plays.
mkdirSync(path.dirname(OUT), { recursive: true });
const part = OUT.replace(/\.mp4$/, ".part.mp4");
const enc = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-loglevel",
    "error",
    "-framerate",
    String(FPS),
    "-i",
    path.join(frames, "f%04d.jpg"),
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "22",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    part,
  ],
  { stdio: "inherit" },
);
rmSync(frames, { recursive: true, force: true });
if (enc.status !== 0) {
  rmSync(part, { force: true });
  console.error("ffmpeg failed; the previous clip is unchanged");
  process.exit(1);
}
renameSync(part, OUT);
const videoSha256 = createHash("sha256")
  .update(readFileSync(OUT))
  .digest("hex");
writeFileSync(
  RECORD,
  `${JSON.stringify({ svgSha256: svgHash(svg), videoSha256, width: WIDTH, height: HEIGHT, seconds: SECONDS }, null, 2)}\n`,
);
console.log(
  `wrote public/media/og-halt-chart.mp4 (${readFileSync(OUT).length} bytes)`,
);
