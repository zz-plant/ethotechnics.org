import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { studio, studioMailto } from "./studio";

/**
 * The Studio was described six ways and reached through two addresses. These
 * tests keep one description and one address: the one the Studio publishes.
 */

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(astro|ts|tsx|json|mdx|txt)$/.test(path) ? [path] : [];
  });

const sources = [...walk("src"), ...walk("public")].filter(
  (file) => !file.endsWith("studio.ts") && !file.endsWith("studio.test.ts"),
);

describe("the Studio has one offer and one address", () => {
  it("lists each offer with a format and an output", () => {
    expect(studio.offers.length).toBeGreaterThan(0);
    for (const offer of studio.offers) {
      expect(offer.name && offer.format && offer.output).toBeTruthy();
    }
  });

  it("builds mail links to the address the Studio publishes", () => {
    expect(studioMailto()).toBe(`mailto:${studio.email}`);
    expect(studioMailto("Review request")).toBe(
      `mailto:${studio.email}?subject=Review%20request`,
    );
  });

  // studio@ethotechnics.org was the Institute's guess at a Studio inbox; the
  // Studio's own site gives a different one.
  it("sends no one to the old Studio address", () => {
    const offenders = sources.filter((file) =>
      readFileSync(file, "utf8").includes("studio@ethotechnics.org"),
    );
    expect(offenders).toEqual([]);
  });

  it("describes no service the Studio does not list", () => {
    const retired = [
      "independent audit verification",
      "custom governance tooling",
      "Independent GRC",
      "Book a facilitated burden modeling session",
    ];
    const offenders = sources.flatMap((file) => {
      const text = readFileSync(file, "utf8");
      return retired
        .filter((phrase) => text.includes(phrase))
        .map((phrase) => `${file}: ${phrase}`);
    });
    expect(offenders).toEqual([]);
  });
});
