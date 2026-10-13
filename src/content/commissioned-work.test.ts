import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { commissionedWork, commissionedWorkMailto } from "./commissioned-work";

/**
 * Commissioned work was described six ways and reached through two addresses,
 * then moved from Ethotechnics Studio to Kanav Jain's own name. These tests
 * keep one description and one address, the ones kanav.net publishes, and
 * keep the retired Studio's name and site off every page.
 */

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(astro|ts|tsx|json|mdx|txt)$/.test(path) ? [path] : [];
  });

const sources = [...walk("src"), ...walk("public")].filter(
  (file) =>
    !file.endsWith("commissioned-work.ts") &&
    !file.endsWith("commissioned-work.test.ts"),
);

const offendersFor = (pattern: RegExp) =>
  sources.filter((file) => pattern.test(readFileSync(file, "utf8")));

describe("commissioned work has one offer and one address", () => {
  it("lists each offer with a format and an output", () => {
    expect(commissionedWork.offers.length).toBeGreaterThan(0);
    for (const offer of commissionedWork.offers) {
      expect(offer.name && offer.format && offer.output).toBeTruthy();
    }
  });

  it("builds mail links to the address kanav.net publishes", () => {
    expect(commissionedWorkMailto()).toBe(
      `mailto:${commissionedWork.email}?subject=Advisory%20or%20fractional%20engagement`,
    );
    expect(commissionedWorkMailto("Engagement feedback")).toBe(
      `mailto:${commissionedWork.email}?subject=Engagement%20feedback`,
    );
  });

  // studio@ethotechnics.org was the Institute's guess at a Studio inbox, and
  // hello@ethotechnics.com was the Studio's own. Neither reaches the work now.
  it("sends no one to a retired address or to ethotechnics.com", () => {
    expect(
      offendersFor(
        /studio@ethotechnics\.org|@ethotechnics\.com|https?:\/\/(www\.)?ethotechnics\.com/,
      ),
    ).toEqual([]);
  });

  it("names no Ethotechnics Studio", () => {
    expect(offendersFor(/Ethotechnics Studio/)).toEqual([]);
  });

  // The llms files are static text, so they cannot import this module. They
  // carry the same link and address by hand; this keeps them in step.
  it("gives agents the same link and address", () => {
    for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
      const text = readFileSync(file, "utf8");
      expect(text).toContain(commissionedWork.href);
      expect(text).toContain(`mailto:${commissionedWork.email}`);
    }
  });

  it("describes no service that was never offered", () => {
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
