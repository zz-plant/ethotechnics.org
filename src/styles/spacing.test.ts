import { describe, expect, it } from "bun:test";
import { Glob } from "bun";
import { fileURLToPath } from "node:url";

/**
 * The site has one spacing scale, defined as --space-* tokens in theme.css:
 * nine steps on a 4px grid plus the rhythm roles built from them
 * (--space-section, --space-block, --space-heading, --space-container,
 * --space-container-compact) and --page-gutter. Before it, stylesheets
 * declared ~440 distinct raw margins, paddings and gaps, and only one
 * declaration in ten used a token, so the gap between sections, the gap
 * under a heading and the padding inside a card changed from component to
 * component. This test keeps raw lengths from creeping back in: every
 * margin, padding, gap, row-gap and column-gap in a stylesheet or an .astro
 * file (its <style> blocks and style attributes) must name a token.
 *
 * Allowed without a token:
 * - theme.css, which defines the scale.
 * - 0, auto, inherit, and % or em values. An em indent or an em icon gap
 *   is meant to scale with the text beside it.
 * - calc() and clamp() built from tokens, including a negative token
 *   (calc(-1 * var(--space-2))) for an optical pull.
 * - Hairlines: 1px or 2px, positive or negative, which offset a border
 *   (the `margin: -1px` of a visually hidden element).
 * - px in a rule whose selector names an SVG or a diagram, where px are
 *   drawing units inside a viewBox.
 *
 * TypeScript is checked too: CSS written into strings (styles a script
 * injects) and React style objects with string values (gap: "0.5rem").
 * Two things are left out on purpose:
 * - Standalone print documents a script assembles as a full HTML page
 *   (<!DOCTYPE html> … </html>). They open in their own window without the
 *   theme stylesheet, so the tokens do not exist there. A print window
 *   built through the DOM instead marks its style string with the comment
 *   "standalone print document". Only that block or string is skipped; the
 *   rest of the file is still checked.
 * - Numeric React values (gap: 8). A bare `gap` or `margin` key in a
 *   TypeScript object is often not a style at all, and telling the two apart
 *   needs a parser; string values are unambiguous.
 */
const SRC = fileURLToPath(new URL("..", import.meta.url));
const EXEMPT_FILES = new Set(["styles/theme.css"]);
const DECLARATION =
  /(?<![\w-])((?:margin|padding)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|gap|row-gap|column-gap)\s*:\s*([^;"}]+)/g;
const RAW_LENGTH = /(\d*\.?\d+)(px|rem)\b/g;
const SVG_SELECTOR = /svg|diagram/i;
const REACT_STYLE =
  /(?<![\w-])((?:margin|padding)(?:Top|Right|Bottom|Left|Inline|Block)?(?:Start|End)?|gap|rowGap|columnGap)\s*:\s*(["'`])([^"'`]*)\2/g;
const PRINT_DOCUMENT =
  /<!DOCTYPE html>[\s\S]*?<\/html>|`[^`]*\/\*\s*standalone print document[^`]*`/gi;
const TOKEN = /var\(\s*--(?:space-[\w-]+|page-gutter)\s*(?:,[^()]*)?\)/g;

type Violation = { file: string; selector: string; declaration: string };

const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, "");

/** Drop every spacing token reference, fallback included, innermost first. */
const stripTokens = (value: string) => {
  let previous: string;
  let next = value;
  do {
    previous = next;
    next = previous.replace(TOKEN, "");
  } while (next !== previous);
  return next;
};

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

const isHairline = (length: RegExpMatchArray) =>
  length[2] === "px" && Number(length[1]) <= 2;

const findViolations = (file: string, raw: string): Violation[] => {
  const text = stripComments(raw);
  const violations: Violation[] = [];
  for (const match of text.matchAll(DECLARATION)) {
    const value = match[2].trim();
    const lengths = [...stripTokens(value).matchAll(RAW_LENGTH)].filter(
      (length) => !isHairline(length),
    );
    if (lengths.length === 0) continue;
    const selector = selectorBefore(text, match.index ?? 0);
    const onlyPx = lengths.every((length) => length[2] === "px");
    if (onlyPx && SVG_SELECTOR.test(selector)) continue;
    violations.push({ file, selector, declaration: `${match[1]}: ${value}` });
  }
  return violations;
};

/** Raw spacing in a TypeScript source: CSS in strings, and React styles. */
const findScriptViolations = (file: string, raw: string): Violation[] => {
  const text = raw.replace(PRINT_DOCUMENT, "");
  const violations = findViolations(file, text);
  for (const match of text.matchAll(REACT_STYLE)) {
    const value = match[3].trim();
    const lengths = [...stripTokens(value).matchAll(RAW_LENGTH)].filter(
      (length) => !isHairline(length),
    );
    if (lengths.length === 0) continue;
    violations.push({
      file,
      selector: "(style object)",
      declaration: `${match[1]}: ${value}`,
    });
  }
  return violations;
};

describe("spacing scale", () => {
  it("every margin, padding and gap outside theme.css uses a --space-* token", async () => {
    const violations: Violation[] = [];
    for (const pattern of ["**/*.css", "**/*.astro"]) {
      for await (const file of new Glob(pattern).scan({ cwd: SRC })) {
        if (EXEMPT_FILES.has(file)) continue;
        const text = await Bun.file(`${SRC}/${file}`).text();
        violations.push(...findViolations(file, text));
      }
    }
    for (const pattern of ["**/*.ts", "**/*.tsx"]) {
      for await (const file of new Glob(pattern).scan({ cwd: SRC })) {
        if (file.endsWith(".test.ts") || file.endsWith(".d.ts")) continue;
        const text = await Bun.file(`${SRC}/${file}`).text();
        violations.push(...findScriptViolations(file, text));
      }
    }
    expect(violations).toEqual([]);
  });

  it("checks script styles and React style objects, but not print documents", () => {
    const source = `
      const a = { gap: "0.5rem", padding: "var(--space-2)" };
      const b = <div style={{ marginTop: "12px", paddingInline: "2px" }} />;
      const css = \`.live { margin: 1.5rem 0; }\`;
      const doc = \`<!DOCTYPE html><html><style>body { margin: 32px; }</style></html>\`;
      const printed = \`/* standalone print document */ body { margin: 32px; }\`;
      const c = { rowGap: "1rem", margin: 0 };
    `;
    expect(
      findScriptViolations("x.tsx", source).map((v) => v.declaration),
    ).toEqual([
      "margin: 1.5rem 0",
      "gap: 0.5rem",
      "marginTop: 12px",
      "rowGap: 1rem",
    ]);
  });

  it("flags raw lengths and passes tokens, relative values and hairlines", () => {
    const css = `
      .a { padding: 1.25rem; }
      .b { margin: var(--space-4) 0; }
      .c { gap: var(--space-2) var(--space-3); }
      .d { margin-top: var(--flow-space, var(--space-4)); }
      .e { padding-left: 1.2em; }
      .f { margin: 0 auto; }
      .g { margin: -1px; }
      .h { gap: 12px; }
      .i { padding: clamp(1rem, 2vw, 2rem); }
      .j { margin-block: calc(var(--space-section) / 2); }
      .k { margin-inline: calc(-1 * var(--space-2)); }
      .l { padding-inline: var(--page-gutter); }
      .m__svg-label { margin-top: 4px; }
      .n { margin-bottom: var(--gap, 1rem); }
      .o { scroll-margin-top: 5rem; }
      .p { row-gap: 0.4rem; }
    `;
    expect(findViolations("x.css", css).map((v) => v.selector)).toEqual([
      ".a",
      ".h",
      ".i",
      ".n",
      ".p",
    ]);
  });
});
