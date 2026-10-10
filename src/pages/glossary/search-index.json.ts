import type { APIRoute } from "astro";

import { glossaryContent } from "../../content/glossary";
import {
  buildGlossaryIndexEntries,
  buildGlossarySearchIndex,
} from "../../content/page-data/glossary-routes";

// The glossary index filter's full-text search, fetched on first use so the
// index page does not carry every definition. See buildGlossarySearchIndex.
export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      buildGlossarySearchIndex(
        buildGlossaryIndexEntries(glossaryContent.categories),
      ),
    ),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
