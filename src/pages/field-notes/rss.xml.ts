import type { APIContext } from "astro";

import { fieldNotesContent } from "../../content/fieldNotes";

const fallbackSite = "https://ethotechnics.org";

const buildItem = (
  base: URL,
  entry: (typeof fieldNotesContent.entries)[number],
) => {
  const link = new URL(
    `${fieldNotesContent.permalink}#${entry.slug}`,
    base,
  ).toString();

  return `\n  <item>\n    <title>${entry.title}</title>\n    <link>${link}</link>\n    <guid>${link}</guid>\n    <description>${entry.summary}</description>\n    <pubDate>${new Date(entry.published).toUTCString()}</pubDate>\n  </item>`;
};

export function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const channelLink = new URL(fieldNotesContent.permalink, siteUrl).toString();
  const items = fieldNotesContent.entries
    .slice()
    .sort(
      (a, b) =>
        new Date(b.published).getTime() - new Date(a.published).getTime(),
    )
    .map((entry) => buildItem(siteUrl, entry))
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>Field Notes — Ethotechnics</title>\n  <link>${channelLink}</link>\n  <description>${fieldNotesContent.pageDescription}</description>\n  <language>en-us</language>\n  <lastBuildDate>${new Date(
    fieldNotesContent.latestUpdate,
  ).toUTCString()}</lastBuildDate>${items}\n</channel>\n</rss>`;

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
