import { describe, expect, it } from "bun:test";
import { Glob } from "bun";

/**
 * Static checks on the hand-drawn SVG diagrams. Each guards a failure that
 * only showed in production or only in one theme, so nothing else caught it:
 *
 * - An inline <style> inside an SVG has no hash in the Content-Security-Policy
 *   header. Production drops it and the drawing renders as black shapes in
 *   the body serif. Diagram rules belong in a linked stylesheet.
 * - A custom property no stylesheet defines falls back to whatever literal
 *   follows it, in both themes. `var(--danger, #e06c75)` did this in nine
 *   diagrams.
 * - A class on a drawn element that no stylesheet defines leaves the element
 *   with browser defaults. `.state-diagram__clause` set only a colour, so its
 *   labels inherited the 17px body serif.
 *
 * The last block covers the box a diagram or a wide table scrolls in. On a
 * phone it overflows, and a keyboard can scroll it only if it takes focus. In
 * October 2026, 39 of them on 32 pages did not (axe:
 * scrollable-region-focusable). The e2e suite checks two routes and CI does
 * not run it, so the rule is checked here, in the source.
 */

const root = new URL("../../../", import.meta.url).pathname;

const read = (path: string) => Bun.file(root + path).text();

const scan = async (pattern: string) => {
  const files: string[] = [];
  for await (const file of new Glob(pattern).scan(root)) files.push(file);
  return files.sort();
};

const diagramFiles = async () => {
  const components = await scan("src/components/**/*.astro");
  const withSvg: { path: string; source: string }[] = [];
  for (const path of components) {
    const source = await read(path);
    // A diagram, not an icon: a drawing with its own coordinate system.
    if (/<svg[^>]*viewBox="0 0 (\d{3,})/.test(source)) {
      withSvg.push({ path, source });
    }
  }
  return withSvg;
};

// Linked stylesheets, plus the top-level <style> blocks of components, which
// Astro bundles like any other stylesheet. A <style> inside an <svg> is not
// counted: that is the case the second test forbids.
const stylesheets = async () => {
  const sheets = await Promise.all(
    (await scan("src/styles/**/*.css")).map((path) => read(path)),
  );
  const componentStyles = await Promise.all(
    (await scan("src/components/**/*.astro")).map(async (path) =>
      [
        ...(await read(path))
          .replace(/<svg[\s\S]*?<\/svg>/g, "")
          .matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g),
      ]
        .map((m) => m[1])
        .join("\n"),
    ),
  );
  return [...sheets, ...componentStyles].join("\n");
};

describe("diagram sources", () => {
  it("finds the diagrams it is meant to check", async () => {
    expect((await diagramFiles()).length).toBeGreaterThan(25);
  });

  it("keeps <style> out of every <svg>", async () => {
    const offenders = (await diagramFiles())
      .filter(({ source }) =>
        [...source.matchAll(/<svg[\s\S]*?<\/svg>/g)].some((m) =>
          m[0].includes("<style"),
        ),
      )
      .map(({ path }) => path);
    expect(offenders).toEqual([]);
  });

  it("uses only custom properties a stylesheet defines", async () => {
    const css = await stylesheets();
    const defined = new Set(
      [...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]),
    );
    const undefinedUses = (await diagramFiles()).flatMap(({ path, source }) =>
      [...source.matchAll(/var\((--[\w-]+)/g)]
        .map((m) => m[1])
        .filter((name) => !defined.has(name))
        .map((name) => `${path}: ${name}`),
    );
    expect([...new Set(undefinedUses)]).toEqual([]);
  });

  it("styles every diagram class it draws with", async () => {
    const css = await stylesheets();
    const defined = new Set(
      [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]),
    );
    const missing = (await diagramFiles()).flatMap(({ path, source }) => {
      const svgs = [...source.matchAll(/<svg[\s\S]*?<\/svg>/g)].map(
        (m) => m[0],
      );
      const classes = svgs.flatMap((svg) =>
        [...svg.matchAll(/\bclass="([^"{}]+)"/g)].flatMap((m) =>
          m[1].split(/\s+/),
        ),
      );
      return [...new Set(classes)]
        .filter((name) => name && !defined.has(name))
        .map((name) => `${path}: .${name}`);
    });
    expect(missing).toEqual([]);
  });

  it("gives the state-diagram text classes a font, not just a colour", async () => {
    const css = await stylesheets();
    for (const name of [
      "state-diagram__state",
      "state-diagram__label",
      "state-diagram__clause",
    ]) {
      const rule = css.match(new RegExp(`\\.${name}\\s*\\{([^}]*)\\}`))?.[1];
      expect(rule, name).toContain("font-family");
      expect(rule, name).toContain("font-size");
    }
  });
});

// The classes that make a box scroll sideways on a phone.
const SCROLLERS = [
  "diagram-scroll",
  "table-responsive",
  "table-wrap",
  "mapping-table__wrapper",
];

// The classes a stylesheet scrolls: the subject of each rule that sets
// overflow to auto or scroll. In `.demo-figure .diagram-scroll` the inner box
// scrolls, not the figure.
const scrollingClasses = (css: string) => {
  const classes = new Set<string>();
  const rules = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .matchAll(/([^{}]+)\{([^{}]*)\}/g);
  for (const [, selectors, body] of rules) {
    if (!/overflow(?:-x)?\s*:\s*(?:auto|scroll)/.test(body)) continue;
    for (const selector of selectors.split(",")) {
      const subject =
        selector
          .trim()
          .split(/[\s>+~]+/)
          .pop() ?? "";
      for (const [, name] of subject.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
        classes.add(name);
      }
    }
  }
  return classes;
};

const classTokens = (attribute: string) => attribute.split(/[\s"'`{}[\],=]+/);

// The whole opening tag around `index`, read past quoted and braced values.
const openingTag = (source: string, index: number) => {
  const start = source.lastIndexOf("<", index);
  let quote = "";
  let depth = 0;
  for (let i = start + 1; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (char === quote) quote = "";
    } else if (char === '"' || char === "'" || char === "`") quote = char;
    else if (char === "{") depth++;
    else if (char === "}") depth--;
    else if (char === ">" && depth === 0) return source.slice(start, i + 1);
  }
  return source.slice(start);
};

const markupFiles = async () =>
  Promise.all(
    (await scan("src/**/*.{astro,mdx,md,tsx}")).map(async (path) => ({
      path,
      source: await read(path),
    })),
  );

const scrollerTags = async () =>
  (await markupFiles()).flatMap(({ path, source }) =>
    [...source.matchAll(/\bclass(?:Name|:list)?=(?:"[^"]*"|\{[^}]*\})/g)]
      .filter((m) => classTokens(m[0]).some((t) => SCROLLERS.includes(t)))
      .map((m) => ({ path, source, tag: openingTag(source, m.index) })),
  );

// The ids a source renders: its own, plus the `${id}-title` heading DemoFigure
// derives from the id it is given.
const renderedIds = (source: string) =>
  new Set([
    ...[...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]),
    ...[...source.matchAll(/<DemoFigure\s[^>]*?\bid="([^"]+)"/g)].map(
      (m) => `${m[1]}-title`,
    ),
  ]);

describe("sideways scrollers", () => {
  it("finds the scrollers it is meant to check", async () => {
    expect((await scrollerTags()).length).toBeGreaterThan(60);
  });

  it("makes every scroller a named region a keyboard can focus", async () => {
    const offenders = (await scrollerTags()).flatMap(({ path, tag }) => {
      const missing = [
        /\btab[iI]ndex=(?:"0"|\{0\})/.test(tag) ? "" : 'tabindex="0"',
        /\brole="region"/.test(tag) ? "" : 'role="region"',
        /\baria-label(?:ledby)?=(?:"[^"]*\S[^"]*"|\{)/.test(tag)
          ? ""
          : "aria-label or aria-labelledby",
      ].filter(Boolean);
      return missing.length
        ? [`${path}: ${tag} lacks ${missing.join(", ")}`]
        : [];
    });
    expect(offenders).toEqual([]);
  });

  it("names a region only from an id its own source renders", async () => {
    const dangling = (await scrollerTags()).flatMap(({ path, source, tag }) => {
      const ids = tag.match(/\baria-labelledby="([^"]+)"/)?.[1].split(/\s+/);
      const rendered = renderedIds(source);
      return (ids ?? [])
        .filter((id) => !rendered.has(id))
        .map((id) => `${path}: #${id}`);
    });
    expect(dangling).toEqual([]);
  });

  // A named <section> is a region landmark too, and two landmarks with one
  // name fail axe's landmark-unique: /evals/coverage did.
  it("gives a region a name no section in its source already has", async () => {
    const name = (tag: string) =>
      tag.match(/\baria-label(?:ledby)?="[^"]+"/)?.[0];
    const shared = (await scrollerTags()).flatMap(({ path, source, tag }) => {
      const own = name(tag);
      const sections = [...source.matchAll(/<section\b/g)].map((m) =>
        name(openingTag(source, m.index)),
      );
      return own && sections.includes(own) ? [`${path}: ${own}`] : [];
    });
    expect(shared).toEqual([]);
  });

  it("covers every class the stylesheets scroll a table or a figure with", async () => {
    const scrolling = scrollingClasses(await stylesheets());
    for (const name of SCROLLERS) expect(scrolling.has(name), name).toBe(true);
    // A figure that scrolls itself has no wrapper to take focus, and its
    // caption scrolls away with the drawing. The drawing scrolls instead, in
    // a .diagram-scroll inside the figure.
    const figureClasses = (await markupFiles()).flatMap(({ source }) =>
      [
        ...source.matchAll(
          /<figure\b[^>]*?\bclass(?::list)?=("[^"]*"|\{[^}]*\})/g,
        ),
      ].flatMap((m) => classTokens(m[1])),
    );
    expect([...new Set(figureClasses)].filter((n) => scrolling.has(n))).toEqual(
      [],
    );
  });
});
