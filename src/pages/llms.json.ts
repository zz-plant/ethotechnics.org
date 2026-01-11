import type { APIContext } from "astro";

import { buildLlmsData, fallbackSite } from "../content/llms";

export function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const data = buildLlmsData(siteUrl);

  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
