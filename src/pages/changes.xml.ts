import type { APIContext } from "astro";

import { changeSources } from "../content/changes";
import { latestChanges, renderChangesRss } from "../utils/changes-feed";

const fallbackSite = "https://ethotechnics.org";

/**
 * Every dated change to the standards, the glossary, the mechanisms library,
 * and the casebook, in one RSS feed: the 50 most recent, newest first.
 */
export function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  return new Response(renderChangesRss(latestChanges(changeSources), siteUrl), {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
