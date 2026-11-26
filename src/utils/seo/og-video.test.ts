import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "bun:test";
import record from "../../data/og-video.json" with { type: "json" };
import {
  haltChartSvg,
  OG_VIDEO_PATH,
  type OgVideoRecord,
  ogVideoFrom,
  svgHash,
} from "./og-video";

const siteBase = "https://ethotechnics.org/";
const svg = haltChartSvg();
const rec: OgVideoRecord = {
  svgSha256: svgHash(svg),
  videoSha256: "0123456789abcdef",
  width: 1200,
  height: 630,
  seconds: 9.2,
};

describe("og:video", () => {
  it("publishes the clip on the home page while it was filmed from the current card", () => {
    const v = ogVideoFrom({ path: "/", template: "home", siteBase }, rec, svg);
    expect(v).toEqual({
      url: "https://ethotechnics.org/media/og-halt-chart.mp4?v=0123456789",
      type: "video/mp4",
      width: 1200,
      height: 630,
    });
  });

  it("withholds the clip once the casebook redraws the card", () => {
    expect(
      ogVideoFrom(
        { path: "/", template: "home", siteBase },
        rec,
        `${svg}<!-- changed -->`,
      ),
    ).toBeNull();
  });

  it("keeps /casebook on the PNG alone, since its card carries a different label", () => {
    expect(ogVideoFrom({ path: "/casebook", siteBase }, rec, svg)).toBeNull();
  });

  it("never puts the clip on a page with another card", () => {
    expect(ogVideoFrom({ path: "/standards", siteBase }, rec, svg)).toBeNull();
    expect(
      ogVideoFrom({ path: "/casebook/robodebt", siteBase }, rec, svg),
    ).toBeNull();
  });

  it("ships the clip its record describes, filmed from the current card", () => {
    const bytes = readFileSync(`public${OG_VIDEO_PATH}`);
    // public/media/og-halt-chart.mp4 must be the clip src/data/og-video.json records.
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(
      record.videoSha256,
    );
    // The halt chart changed since the clip was filmed: run `bun run og:video`. The build
    // withholds the tag until then, so this catches it before a deploy drops the video.
    expect(record.svgSha256).toBe(svgHash(svg));
  });
});
