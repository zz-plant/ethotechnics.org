import type { APIRoute } from "astro";

import { libraryContent } from "../../content/library";

export const GET: APIRoute = async () => {
  const patterns = libraryContent.patterns.entries.map((pattern) => ({
    slug: pattern.slug,
    title: pattern.title,
    summary: pattern.summary,
    filters: pattern.filters,
    glossaryRefs: pattern.glossaryRefs,
    href: `/mechanisms/patterns/${pattern.slug}`,
  }));

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: patterns.length,
      permalink: libraryContent.permalink,
    },
    patterns,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
