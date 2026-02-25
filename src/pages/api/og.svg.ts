import type { APIContext } from "astro";
import {
  buildOgSvg,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from "../../utils/og-image";

export function GET({ request }: APIContext) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title")?.trim() || DEFAULT_TITLE;
  const description =
    url.searchParams.get("description")?.trim() || DEFAULT_DESCRIPTION;
  const template = url.searchParams.get("template")?.trim() || undefined;
  const path = url.searchParams.get("path")?.trim() || undefined;

  return new Response(buildOgSvg(title, description, { template, path }), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
