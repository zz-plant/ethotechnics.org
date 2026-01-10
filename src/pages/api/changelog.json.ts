import type { APIRoute } from "astro";

import { libraryContent } from "../../content/library";
import { researchContent } from "../../content/research";

const changelogEntries = [
  ...libraryContent.publication.changelog.map((entry) => ({
    source: "Mechanisms",
    version: entry.version,
    date: entry.date,
    summary: entry.summary,
    href: libraryContent.permalink,
  })),
  ...researchContent.publication.changelog.map((entry) => ({
    source: "Research",
    version: entry.version,
    date: entry.date,
    summary: entry.summary,
    href: researchContent.permalink,
  })),
].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export const GET: APIRoute = async () => {
  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: changelogEntries.length,
    },
    entries: changelogEntries,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
