import { describe, expect, it } from "bun:test";
import { Glob } from "bun";
import { fileURLToPath } from "node:url";

/**
 * The site has one type scale, defined as --text-* tokens in theme.css.
 * Before it, pages declared ~67 distinct font sizes and rendered 14-19 each,
 * so labels, body and UI text competed at near-identical sizes. This test
 * keeps raw lengths from creeping back in: every `font-size:` in a
 * stylesheet or an .astro file (its <style> blocks and style attributes)
 * must name a token.
 *
 * Allowed without a token:
 * - theme.css, which defines the scale and its breakpoint overrides.
 * - em and % sizes, relative to the parent: inline code, glyphs, marks.
 * - inherit / initial / unset.
 * - pt, used only by the print stylesheet.
 * - px in a rule whose selector names an SVG or a diagram. That text sits
 *   inside a viewBox and scales with the drawing, so its px are drawing
 *   units, not page type.
 */
const SRC = fileURLToPath(new URL("..", import.meta.url));
const EXEMPT_FILES = new Set(["styles/theme.css"]);
const RAW_LENGTH = /\d*\.?\d+(px|rem)\b/g;
const SVG_SELECTOR = /svg|diagram/i;

type Violation = { file: string; selector: string; value: string };

const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, "");

/** Drop every var(--text-…) reference, fallback included. */
const stripTokens = (value: string) =>
  value.replace(/var\(\s*--text-[\w-]+\s*(,[^()]*(\([^()]*\))?[^()]*)?\)/g, "");

const selectorBefore = (text: string, index: number) => {
  const open = text.lastIndexOf("{", index);
  if (open === -1) return "";
  const start = Math.max(
    text.lastIndexOf("}", open),
    text.lastIndexOf(";", open),
    text.lastIndexOf("{", open - 1),
  );
  return text.slice(start + 1, open).trim();
};

const findViolations = (file: string, raw: string): Violation[] => {
  const text = stripComments(raw);
  const violations: Violation[] = [];
  for (const match of text.matchAll(/font-size\s*:\s*([^;"}]+)/g)) {
    const value = match[1].trim();
    const lengths = [...stripTokens(value).matchAll(RAW_LENGTH)];
    if (lengths.length === 0) continue;
    const selector = selectorBefore(text, match.index ?? 0);
    const onlyPx = lengths.every((length) => length[1] === "px");
    if (onlyPx && SVG_SELECTOR.test(selector)) continue;
    violations.push({ file, selector, value });
  }
  return violations;
};

describe("type scale", () => {
  it("every font-size outside theme.css uses a --text-* token", async () => {
    const violations: Violation[] = [];
    for (const pattern of ["**/*.css", "**/*.astro"]) {
      for await (const file of new Glob(pattern).scan({ cwd: SRC })) {
        if (EXEMPT_FILES.has(file)) continue;
        const text = await Bun.file(`${SRC}/${file}`).text();
        violations.push(...findViolations(file, text));
      }
    }
    expect(violations).toEqual([]);
  });

  it("flags raw lengths and passes tokens, relative sizes and SVG text", () => {
    const css = `
      .a { font-size: 0.85rem; }
      .b { font-size: var(--text-sm); }
      .c { font-size: var(--text-lg, 1.1rem); }
      .d code { font-size: 0.9em; }
      .e { font-size: inherit; }
      .f__svg-label { font-size: 11px; }
      .g { font-size: 14px; }
      .h { font-size: clamp(1rem, 2vw, 2rem); }
      .i { font-size: calc(var(--text-sm) * 0.9); }
    `;
    expect(findViolations("x.css", css).map((v) => v.selector)).toEqual([
      ".a",
      ".g",
      ".h",
    ]);
  });
});
