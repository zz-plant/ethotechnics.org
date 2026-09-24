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
      const rule = css.match(
        new RegExp(`\\.${name}\\s*\\{([^}]*)\\}`),
      )?.[1];
      expect(rule, name).toContain("font-family");
      expect(rule, name).toContain("font-size");
    }
  });
});
