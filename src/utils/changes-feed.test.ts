import { describe, expect, it } from "bun:test";

import { changeSources } from "../content/changes";
import type { Case } from "../content/casebook";
import type { StandardEntry } from "../content/standards";
import type { PublicationMetadata } from "../content/types";
import {
  CHANGES_FEED_LIMIT,
  collectChanges,
  latestChanges,
  renderChangesRss,
  renderReleaseNotes,
  sortChanges,
  type ChangeSources,
} from "./changes-feed";

const site = new URL("https://ethotechnics.org");

const publication = (
  changelog: PublicationMetadata["changelog"],
): PublicationMetadata => ({
  authors: [],
  contact: "hello@ethotechnics.org",
  published: "2025-12-03T00:00:00Z",
  version: changelog[0]?.version ?? "v1",
  changelog,
  license: { label: "CC BY-SA 4.0", href: "https://example.org" },
  attribution: "",
});

const standard = (overrides: Partial<StandardEntry>): StandardEntry => ({
  id: "STD-02",
  slug: "std-02-contestability-recourse",
  title: "Contestability & Recourse",
  description: "",
  status: "Draft",
  version: "1.3",
  stableCriteria: "",
  effectiveDate: "TBD",
  published: "2026-01-01",
  ...overrides,
});

const sources: ChangeSources = {
  standards: [
    standard({
      changelogHref:
        "/standards/std-02-contestability-recourse#publication-history",
      changelogEntries: [
        { version: "1.3", date: "2026-10-03", summary: "Adds Article VI." },
        { version: "0.9", date: "2026-01-01", summary: "Peer review draft." },
      ],
    }),
    standard({
      id: "STD-99",
      slug: "std-99-hidden",
      listedOnSite: false,
      changelogEntries: [
        { version: "1.0", date: "2026-12-01", summary: "Not published." },
      ],
    }),
  ],
  glossary: {
    permalink: "/glossary",
    publication: publication([
      { version: "v1.17.1", date: "2026-10-06", summary: "Sentence case." },
    ]),
  },
  library: {
    permalink: "/mechanisms",
    publication: publication([
      { version: "v1.2.0", date: "2026-10-01", summary: "Six safeguards." },
    ]),
  },
  cases: [
    {
      slug: "robodebt",
      title: "Robodebt",
      summary: "Debts raised by averaging income.",
      published: "2026-09-17T00:00:00Z",
    } as Case,
    {
      slug: "apple-card",
      title: "Apple Card credit limits",
      summary: "Credit limits set by a model.",
      published: "2026-09-17T00:00:00Z",
      updated: "2026-10-04T00:00:00Z",
    } as Case,
  ],
};

describe("collectChanges", () => {
  it("merges every source and leaves out unlisted standards", () => {
    const entries = collectChanges(sources);
    expect(entries.map((entry) => entry.source).sort()).toEqual([
      "Casebook",
      "Casebook",
      "Casebook",
      "Glossary",
      "Mechanisms",
      "STD-02",
      "STD-02",
    ]);
  });

  it("links each change to the page that carries it", () => {
    const byId = new Map(
      collectChanges(sources).map((entry) => [entry.id, entry]),
    );
    expect(byId.get("STD-02:v1.3:2026-10-03")?.href).toBe(
      "/standards/std-02-contestability-recourse#publication-history",
    );
    expect(byId.get("glossary:v1.17.1:2026-10-06")?.href).toBe("/glossary");
    expect(byId.get("mechanisms:v1.2.0:2026-10-01")?.title).toBe(
      "Mechanisms library v1.2.0",
    );
    expect(byId.get("casebook:apple-card:2026-10-04")?.title).toBe(
      "Casebook: Apple Card credit limits, revised",
    );
  });
});

describe("sortChanges", () => {
  it("puts the newest first and breaks same-day ties by title", () => {
    const sorted = sortChanges(collectChanges(sources));
    expect(sorted.map((entry) => entry.date)).toEqual([
      "2026-10-06",
      "2026-10-04",
      "2026-10-03",
      "2026-10-01",
      "2026-09-17",
      "2026-09-17",
      "2026-01-01",
    ]);
    expect(sorted[4]!.title).toBe("Casebook: Apple Card credit limits");
    expect(sorted[5]!.title).toBe("Casebook: Robodebt");
  });

  it("gives the same order whatever order the sources arrive in", () => {
    const entries = collectChanges(sources);
    expect(sortChanges([...entries].reverse())).toEqual(sortChanges(entries));
  });
});

describe("renderChangesRss", () => {
  const rss = renderChangesRss(latestChanges(sources, 3), site);

  it("is RSS 2.0 with one item per change, newest first", () => {
    expect(rss.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(rss).toContain('<rss version="2.0"');
    expect(rss.match(/<item>/g)).toHaveLength(3);
    expect(rss).toContain(
      "<lastBuildDate>Tue, 06 Oct 2026 00:00:00 GMT</lastBuildDate>",
    );
    expect(rss.indexOf("Glossary v1.17.1")).toBeLessThan(
      rss.indexOf("STD-02 v1.3"),
    );
  });

  it("escapes markup in titles and links to absolute URLs", () => {
    expect(rss).toContain("STD-02 v1.3: Contestability &amp; Recourse");
    expect(rss).not.toContain("Contestability & Recourse");
    expect(rss).toContain(
      "<link>https://ethotechnics.org/standards/std-02-contestability-recourse#publication-history</link>",
    );
  });
});

describe("the site's own feed", () => {
  const entries = latestChanges(changeSources);

  it("is capped at the feed limit with unique ids", () => {
    expect(entries.length).toBeLessThanOrEqual(CHANGES_FEED_LIMIT);
    expect(entries.length).toBeGreaterThan(10);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length);
  });

  it("carries only dates and site paths", () => {
    for (const entry of entries) {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.href.startsWith("/")).toBe(true);
    }
  });
});

describe("renderReleaseNotes", () => {
  const entries = collectChanges(sources);

  it("lists the changes on or after the last release", () => {
    const notes = renderReleaseNotes(entries, site, "2026-10-03");
    expect(notes).toContain("Changes recorded on or after 2026-10-03.");
    expect(notes).toContain(
      "[Glossary v1.17.1](https://ethotechnics.org/glossary)",
    );
    expect(notes).toContain("STD-02 v1.3");
    expect(notes).not.toContain("Six safeguards");
    expect(notes).toContain("https://ethotechnics.org/changes.xml");
  });

  it("says so when nothing changed", () => {
    expect(renderReleaseNotes(entries, site, "2027-01-01")).toBe(
      "No dated changes recorded on or after 2027-01-01.\n",
    );
  });

  it("lists the most recent changes for a first release", () => {
    expect(renderReleaseNotes(entries, site)).toContain(
      "The 7 most recent recorded changes.",
    );
  });
});
