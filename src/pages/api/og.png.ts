import type { APIContext } from "astro";
import {
  buildOgEtag,
  isIfNoneMatchSatisfied,
  normalizeOgRequestInput,
  renderOgPng,
} from "../../utils/og-image";

const OG_CACHE_CONTROL =
  "public, max-age=0, s-maxage=604800, stale-while-revalidate=86400, stale-if-error=604800";

export async function GET({ request }: APIContext) {
  const url = new URL(request.url);
  const normalizedInput = normalizeOgRequestInput({
    title: url.searchParams.get("title") ?? undefined,
    description: url.searchParams.get("description") ?? undefined,
    template: url.searchParams.get("template") ?? undefined,
    path: url.searchParams.get("path") ?? undefined,
  });

  const etag = buildOgEtag(normalizedInput);

  if (isIfNoneMatchSatisfied(request.headers.get("If-None-Match"), etag)) {
    return new Response(null, {
      status: 304,
      headers: {
        "Cache-Control": OG_CACHE_CONTROL,
        ETag: etag,
      },
    });
  }

  const pngBuffer = await renderOgPng(
    normalizedInput.title,
    normalizedInput.description,
    {
      template: normalizedInput.template,
      path: normalizedInput.path,
    },
  );

  const pngData = Uint8Array.from(pngBuffer);
  const pngBlob = new Blob([pngData], { type: "image/png" });

  return new Response(pngBlob, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": OG_CACHE_CONTROL,
      ETag: etag,
    },
  });
}
