import type { APIContext } from "astro";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  renderOgPng,
} from "../../utils/og-image";

export async function GET({ request }: APIContext) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title")?.trim() || DEFAULT_TITLE;
  const description =
    url.searchParams.get("description")?.trim() || DEFAULT_DESCRIPTION;
  const pngBuffer = await renderOgPng(title, description);

  return new Response(pngBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
