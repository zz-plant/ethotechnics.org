import type { APIContext } from "astro";

import { buildLlmsData, fallbackSite, renderLlmsText } from "../content/llms";

export function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const data = buildLlmsData(siteUrl);

  return new Response(renderLlmsText(data), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
