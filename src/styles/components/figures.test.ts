import { describe, expect, it } from "bun:test";

/**
 * Astro inlines any stylesheet smaller than this many bytes as a <style>
 * element (build.inlineStylesheets: "auto", vite.build.assetsInlineLimit).
 */
const ASTRO_INLINE_LIMIT = 4096;

describe("the figure stylesheet ships as a link, not an inline style", () => {
  it("stays above Astro's inline limit", async () => {
    // The figures render through MDX content, and an inlined stylesheet on
    // those pages arrives without its hash in the Content-Security-Policy
    // header, so the browser drops it and every figure renders unstyled. A
    // linked stylesheet is allowed by style-src 'self'. If this file ever
    // shrinks below the limit, the figures break only in production; this
    // test fails first.
    const size = (
      await Bun.file(new URL("./figures.css", import.meta.url)).arrayBuffer()
    ).byteLength;
    expect(size).toBeGreaterThan(ASTRO_INLINE_LIMIT * 2);
  });

  it("carries every figure's rules, so no figure ships a small file of its own", async () => {
    const css = await Bun.file(
      new URL("./figures.css", import.meta.url),
    ).text();
    for (const prefix of [
      ".demo-figure",
      ".theater",
      ".loop",
      ".friction",
      ".absorb",
      ".withdraw",
      ".ratchet",
      ".chain-pause",
    ]) {
      expect(css).toContain(`${prefix}`);
    }
  });
});
