/**
 * One list of every dated change the site records: each standard's
 * changelog, the glossary's and the mechanisms library's publication
 * changelogs, and each casebook entry. /changes.xml serves it as RSS, and
 * the release workflow writes a release's notes from it
 * (scripts/presence/release-notes.ts), so a reader and an archive see the
 * same history.
 */
import type { Case } from "../content/casebook";
import type { StandardEntry } from "../content/standards";
import type { PublicationMetadata } from "../content/types";

export interface ChangeEntry {
  /** What changed: a standard id, "Glossary", "Mechanisms", or "Casebook". */
  source: string;
  title: string;
  /** YYYY-MM-DD. */
  date: string;
  summary: string;
  /** Site path of the page that carries the change. */
  href: string;
  /** Unique across the feed, stable across rebuilds. */
  id: string;
}

export interface ChangeSources {
  standards: StandardEntry[];
  glossary: { permalink: string; publication: PublicationMetadata };
  library: { permalink: string; publication: PublicationMetadata };
  cases: Case[];
}

export const CHANGES_FEED_LIMIT = 50;

const day = (value: string): string => value.slice(0, 10);
const versionLabel = (version: string): string =>
  `v${version.replace(/^v/i, "")}`;

const fromPublication = (
  source: string,
  name: string,
  content: { permalink: string; publication: PublicationMetadata },
): ChangeEntry[] =>
  content.publication.changelog.map((entry) => ({
    source,
    title: `${name} ${versionLabel(entry.version)}`,
    date: day(entry.date),
    summary: entry.summary,
    href: content.permalink,
    id: `${source.toLowerCase()}:${versionLabel(entry.version)}:${day(entry.date)}`,
  }));

/** Every dated change, in no particular order. */
export const collectChanges = ({
  standards,
  glossary,
  library,
  cases,
}: ChangeSources): ChangeEntry[] => [
  ...standards
    .filter((standard) => standard.listedOnSite !== false)
    .flatMap((standard) =>
      (standard.changelogEntries ?? []).map((entry) => ({
        source: standard.id,
        title: `${standard.id} ${versionLabel(entry.version)}: ${standard.title}`,
        date: day(entry.date),
        summary: entry.summary,
        href:
          entry.href ?? standard.changelogHref ?? `/standards/${standard.slug}`,
        id: `${standard.id}:${versionLabel(entry.version)}:${day(entry.date)}`,
      })),
    ),
  ...fromPublication("Glossary", "Glossary", glossary),
  ...fromPublication("Mechanisms", "Mechanisms library", library),
  ...cases.flatMap((entry) => {
    const href = `/casebook/${entry.slug}`;
    const added: ChangeEntry = {
      source: "Casebook",
      title: `Casebook: ${entry.title}`,
      date: day(entry.published),
      summary: entry.summary,
      href,
      id: `casebook:${entry.slug}:${day(entry.published)}`,
    };
    return entry.updated && day(entry.updated) !== day(entry.published)
      ? [
          added,
          {
            ...added,
            title: `Casebook: ${entry.title}, revised`,
            date: day(entry.updated),
            id: `casebook:${entry.slug}:${day(entry.updated)}`,
          },
        ]
      : [added];
  }),
];

/** Newest first; same-day changes in title order, so the feed never reshuffles. */
export const sortChanges = (entries: ChangeEntry[]): ChangeEntry[] =>
  [...entries].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      a.title.localeCompare(b.title) ||
      a.id.localeCompare(b.id),
  );

export const latestChanges = (
  sources: ChangeSources,
  limit = CHANGES_FEED_LIMIT,
): ChangeEntry[] => sortChanges(collectChanges(sources)).slice(0, limit);

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const rssDate = (date: string): string =>
  new Date(`${date}T00:00:00Z`).toUTCString();

export const CHANGES_FEED_TITLE = "Ethotechnics changes";
export const CHANGES_FEED_PATH = "/changes.xml";

export const renderChangesRss = (entries: ChangeEntry[], site: URL): string => {
  const self = new URL(CHANGES_FEED_PATH, site).toString();
  const items = entries
    .map((entry) => {
      const link = new URL(entry.href, site).toString();
      return [
        "  <item>",
        `    <title>${escapeXml(entry.title)}</title>`,
        `    <link>${escapeXml(link)}</link>`,
        `    <guid isPermaLink="false">${escapeXml(entry.id)}</guid>`,
        `    <category>${escapeXml(entry.source)}</category>`,
        `    <description>${escapeXml(entry.summary)}</description>`,
        `    <pubDate>${rssDate(entry.date)}</pubDate>`,
        "  </item>",
      ].join("\n");
    })
    .join("\n");
  const lastBuild = entries[0]
    ? `\n  <lastBuildDate>${rssDate(entries[0].date)}</lastBuildDate>`
    : "";
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `  <title>${CHANGES_FEED_TITLE}</title>`,
    `  <link>${new URL("/record", site).toString()}</link>`,
    `  <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml" />`,
    "  <description>Every dated change to the standards, the glossary, the mechanisms library, and the casebook, newest first.</description>",
    `  <language>en-us</language>${lastBuild}`,
    items,
    "</channel>",
    "</rss>",
    "",
  ].join("\n");
};

/** Markdown release notes: the changes on or after `since`, else the latest. */
export const renderReleaseNotes = (
  entries: ChangeEntry[],
  site: URL,
  since?: string,
): string => {
  const sorted = sortChanges(entries);
  const chosen = since
    ? sorted.filter((entry) => entry.date >= since)
    : sorted.slice(0, 20);
  const heading = since
    ? `Changes recorded on or after ${since}.`
    : `The ${chosen.length} most recent recorded changes.`;
  if (chosen.length === 0) {
    return `No dated changes recorded on or after ${since}.\n`;
  }
  return [
    heading,
    "",
    ...chosen.map(
      (entry) =>
        `- **${entry.date}** · [${entry.title}](${new URL(entry.href, site).toString()}): ${entry.summary}`,
    ),
    "",
    `The full history is at ${new URL(CHANGES_FEED_PATH, site).toString()}.`,
    "",
  ].join("\n");
};
