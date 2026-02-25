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
  const template = url.searchParams.get("template")?.trim() || undefined;
  const path = url.searchParams.get("path")?.trim() || undefined;
  const pngBuffer = await renderOgPng(title, description, { template, path });

  const pngData = Uint8Array.from(pngBuffer);
  const pngBlob = new Blob([pngData], { type: "image/png" });

  return new Response(pngBlob, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
