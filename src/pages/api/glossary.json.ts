import type { APIRoute } from "astro";

import { glossaryContent } from "../../content/glossary";
import { glossaryEntryPermalink } from "../../utils/glossary";

export const GET: APIRoute = async () => {
  const entries = glossaryContent.categories.flatMap((category) =>
    category.entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      status: entry.status,
      category: {
        id: category.id,
        heading: category.heading,
      },
      tags: entry.tags ?? [],
      href: glossaryEntryPermalink(entry.id),
    })),
  );

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: entries.length,
      permalink: glossaryContent.permalink,
    },
    entries,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
