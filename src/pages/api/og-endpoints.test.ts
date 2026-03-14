import { describe, expect, it } from "bun:test";

import { buildOgEtag, normalizeOgRequestInput } from "../../utils/og-image";

const OG_CACHE_CONTROL =
  "public, max-age=0, s-maxage=604800, stale-while-revalidate=86400, stale-if-error=604800";

describe("OG API endpoints", () => {
  it("returns stable cache headers and etag for svg responses", async () => {
    const { GET } = await import("./og.svg");
    const request = new Request(
      "https://example.com/api/og.svg?title=  Sample%20Title  &description=Sample%20Description",
    );

    const response = GET({ request } as never);

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(OG_CACHE_CONTROL);
    expect(response.headers.get("ETag")).toBeString();
  });

  it("returns 304 when if-none-match matches for svg responses", async () => {
    const { GET } = await import("./og.svg");
    const initial = GET({
      request: new Request(
        "https://example.com/api/og.svg?title=Stable&description=Validator",
      ),
    } as never);

    const etag = initial.headers.get("ETag");
    const conditional = GET({
      request: new Request(
        "https://example.com/api/og.svg?title=Stable&description=Validator",
        {
          headers: {
            "If-None-Match": etag ?? "",
          },
        },
      ),
    } as never);

    expect(etag).toBeString();
    expect(conditional.status).toBe(304);
    expect(conditional.headers.get("Cache-Control")).toBe(OG_CACHE_CONTROL);
    expect(conditional.headers.get("ETag")).toBe(etag);
  });

  it("returns 304 and stable cache headers for png responses", async () => {
    const { GET } = await import("./og.png");
    const normalizedInput = normalizeOgRequestInput({
      title: "Png Title",
      description: "Png Description",
      template: "editorial",
      path: "/research/agenda",
    });
    const etag = buildOgEtag(normalizedInput);

    const response = await GET({
      request: new Request(
        "https://example.com/api/og.png?title=Png%20Title&description=Png%20Description&template=editorial&path=/research/agenda",
        {
          headers: {
            "If-None-Match": etag,
          },
        },
      ),
    } as never);

    expect(response.status).toBe(304);
    expect(response.headers.get("Cache-Control")).toBe(OG_CACHE_CONTROL);
    expect(response.headers.get("ETag")).toBe(etag);
  });
});
