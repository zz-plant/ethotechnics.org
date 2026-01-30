import { Resvg } from "@resvg/resvg-js";
import type { APIContext } from "astro";
import {
  buildOgSvg,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  WIDTH,
} from "../../utils/og-image";

export function GET({ request }: APIContext) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title")?.trim() || DEFAULT_TITLE;
  const description =
    url.searchParams.get("description")?.trim() || DEFAULT_DESCRIPTION;
  const svg = buildOgSvg(title, description);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });
  const pngData = resvg.render().asPng();
  const body = new Uint8Array(pngData);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
