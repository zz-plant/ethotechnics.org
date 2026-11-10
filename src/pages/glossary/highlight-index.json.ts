import type { APIRoute } from "astro";

import { buildGlossaryHighlightIndex } from "../../content/page-data/glossary-highlight-index";

// The terms the in-page highlighter marks, fetched by pages that have prose
// to mark so no page bundles the glossary. See buildGlossaryHighlightIndex.
export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildGlossaryHighlightIndex()), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
