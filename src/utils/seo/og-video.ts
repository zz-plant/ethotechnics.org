/**
 * The `og:video` for the home page, whose card is the halt chart.
 *
 * The clip is the halt chart card filmed by `bun run og:video`: every bar grows at the same rate,
 * one day of the case per unit of length, and each stops on the day someone stepped in. It is
 * the card's own SVG, so it shows the same cases, durations and order as the PNG beside it.
 *
 * The chart is drawn from `src/data/casebook.json`, so a case added or rescored redraws the card,
 * and a clip filmed from the old card would contradict it. The clip's record keeps the hash of
 * the SVG it was filmed from; while the card still hashes to that, the clip is published, and
 * once it does not, the tag is withheld and the page shares the PNG alone. A stale clip is never
 * served.
 */
import { createHash } from "node:crypto";
import record from "../../data/og-video.json" with { type: "json" };
import { buildOgCardSvg, resolveOgCard } from "./og-cards";

export const OG_VIDEO_PATH = "/media/og-halt-chart.mp4";

export interface OgVideoRecord {
  svgSha256: string;
  videoSha256: string;
  width: number;
  height: number;
  seconds: number;
}

export interface OgVideo {
  url: string;
  type: "video/mp4";
  width: number;
  height: number;
}

export const svgHash = (svg: string) =>
  createHash("sha256").update(svg).digest("hex").slice(0, 16);

/** The halt chart as the home page's card draws it: the clip is always filmed from this one. */
export const haltChartSvg = () =>
  buildOgCardSvg("", "", { template: "home", path: "/" });

/**
 * Pure: the clip for a page, given the page's path and template, the clip's record, and the
 * current halt chart SVG.
 */
export function ogVideoFrom(
  options: { path: string; template?: string; siteBase: string },
  rec: OgVideoRecord | null,
  currentSvg: string,
): OgVideo | null {
  if (!rec) return null;
  // `/casebook` shares the chart under a different section label, so the home clip would not
  // match its card; it keeps the PNG alone.
  const card = resolveOgCard(options);
  if (card.kind !== "halt-chart" || card.template !== "home") return null;
  if (svgHash(currentSvg) !== rec.svgSha256) return null;
  const url = new URL(OG_VIDEO_PATH, options.siteBase);
  url.searchParams.set("v", rec.videoSha256.slice(0, 10));
  return {
    url: url.toString(),
    type: "video/mp4",
    width: rec.width,
    height: rec.height,
  };
}

export const ogVideoFor = (options: {
  path: string;
  template?: string;
  siteBase: string;
}) => ogVideoFrom(options, record, haltChartSvg());
