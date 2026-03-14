import type { APIContext } from "astro";
import {
  buildOgEtag,
  buildOgSvg,
  isIfNoneMatchSatisfied,
  normalizeOgRequestInput,
} from "../../utils/og-image";

const OG_CACHE_CONTROL =
  "public, max-age=0, s-maxage=604800, stale-while-revalidate=86400, stale-if-error=604800";

export function GET({ request }: APIContext) {
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

  return new Response(
    buildOgSvg(normalizedInput.title, normalizedInput.description, {
      template: normalizedInput.template,
      path: normalizedInput.path,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": OG_CACHE_CONTROL,
        ETag: etag,
      },
    },
  );
}
