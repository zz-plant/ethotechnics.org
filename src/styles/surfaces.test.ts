import { Glob } from "bun";
import { describe, expect, it } from "bun:test";

/**
 * The surface system has three radii and two shadows (see theme.css):
 *
 * - border-radius: 0, 50% (a circle), inherit, or a --radius-* token.
 *   The tokens are --radius-xs (small), --radius-md (medium) and
 *   --radius-pill; the other --radius-* names are aliases of those.
 * - box-shadow: none, or --shadow-float for what floats above the page. A
 *   card or a panel never carries a literal shadow; it is set off by a
 *   hairline or a tint.
 *
 * The site once declared seventeen radii and twenty shadows, one per
 * stylesheet author. These checks fail when a new literal comes back, so the
 * value goes into theme.css or onto an existing token instead.
 */

const SRC = new URL("..", import.meta.url).pathname;

type Sheet = { path: string; css: string };

async function sheets(): Promise<Sheet[]> {
  const out: Sheet[] = [];
  for await (const path of new Glob("**/*.{css,astro}").scan(SRC)) {
    let css = await Bun.file(`${SRC}${path}`).text();
    if (path.endsWith(".astro")) {
      css = [...css.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
        .map((m) => m[1])
        .join("\n");
    }
    out.push({ path, css: css.replace(/\/\*[\s\S]*?\*\//g, "") });
  }
  return out;
}

const RADIUS_DECL =
  /(?<![\w-])border(?:-(?:top|bottom)-(?:left|right))?-radius\s*:\s*([^;}]+)/g;
const ALLOWED_RADIUS_PART = /^(0|50%|inherit|var\(--radius[\w-]*\))$/;

describe("surfaces", () => {
  it("declares border-radius only as 0, 50% or a --radius-* token", async () => {
    const offenders: string[] = [];
    for (const { path, css } of await sheets()) {
      if (path === "styles/theme.css") continue;
      for (const m of css.matchAll(RADIUS_DECL)) {
        const parts = m[1]
          .replace(/!important/, "")
          .trim()
          .split(/\s+/);
        if (!parts.every((p) => ALLOWED_RADIUS_PART.test(p))) {
          offenders.push(`${path}: border-radius: ${m[1].trim()}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("gives no card or panel a literal box-shadow", async () => {
    const offenders: string[] = [];
    for (const { path, css } of await sheets()) {
      // Innermost rule blocks: the selector is the text before the brace.
      for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const selector = m[1].trim();
        if (!/\.[\w-]*(card|panel)(?![\w-])/.test(selector)) continue;
        for (const d of m[2].matchAll(/(?<![\w-])box-shadow\s*:\s*([^;]+)/g)) {
          const value = d[1].trim();
          // Tokens and `none` are fine: the tokens resolve to none or float.
          const literal = value
            .replace(/!important/, "")
            .replace(/var\(--[\w-]+\)/g, "")
            .replace(/[,\s]/g, "")
            .replace(/^none$/, "");
          if (literal)
            offenders.push(`${path}: ${selector} { box-shadow: ${value} }`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
