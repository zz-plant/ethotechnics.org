import { describe, expect, it } from "bun:test";

import { buildOgEtag, normalizeOgRequestInput } from "../../seo/og-image";

const OG_CACHE_CONTROL =
  "public, max-age=0, s-maxage=604800, stale-while-revalidate=86400, stale-if-error=604800";

describe("OG API endpoints", () => {
  it("returns stable cache headers and etag for svg responses", async () => {
    const { GET } = await import("../../../pages/api/og.svg");
    const request = new Request(
      "https://example.com/api/og.svg?title=  Sample%20Title  &description=Sample%20Description",
    );

    const response = GET({ request } as never);

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(OG_CACHE_CONTROL);
    expect(response.headers.get("ETag")).toBeString();
  });

  it("returns 304 when if-none-match matches for svg responses", async () => {
    const { GET } = await import("../../../pages/api/og.svg");
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
    const { GET } = await import("../../../pages/api/og.png");
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

  it("renders a full PNG image with visible text rather than an empty textless frame", async () => {
    const { GET } = await import("../../../pages/api/og.png");
    const response = await GET({
      request: new Request(
        "https://example.com/api/og.png?title=Ethotechnics%20Institute&description=Standards,%20mechanisms,%20and%20validators%20for%20accountable%20system%20governance.&template=home",
      ),
    } as never);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(response.headers.get("Cache-Control")).toBe(OG_CACHE_CONTROL);
    expect(response.headers.get("ETag")).toBeString();

    const buffer = new Uint8Array(await response.arrayBuffer());
    // Valid PNG signature bytes
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50);
    expect(buffer[2]).toBe(0x4e);
    expect(buffer[3]).toBe(0x47);

    // When fonts are missing or fail to load, resvg drops all text elements,
    // producing a textless frame of ~9.9 KB.
    // When fonts are properly supplied, the rendered PNG includes all text and is > 25 KB.
    expect(buffer.length).toBeGreaterThan(25000);
  });
});
