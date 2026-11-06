import { afterEach, describe, expect, it, mock } from "bun:test";

import { POST } from "../src/pages/api/subscribe";
import { createPostContext } from "./helpers/post-context";

const originalFetch = globalThis.fetch;

const createContext = (
  body: string,
  env?: Record<string, unknown>,
  headers?: Record<string, string>,
) => createPostContext("/api/subscribe", body, env, headers);

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("newsletter subscription API", () => {
  it("fails closed when durable delivery is not configured", async () => {
    const response = await POST(
      createContext(JSON.stringify({ email: "person@example.org" })),
    );

    expect(response.status).toBe(503);
  });

  it("rejects cross-origin requests and unsupported media types", async () => {
    const crossOrigin = await POST(
      createContext("{}", {}, { Origin: "https://attacker.example" }),
    );
    const wrongType = await POST(
      createContext("{}", {}, { "Content-Type": "text/plain" }),
    );

    expect(crossOrigin.status).toBe(403);
    expect(wrongType.status).toBe(415);
  });

  it("returns 429 when the Cloudflare limiter rejects a request", async () => {
    const response = await POST(
      createContext("{}", {
        NEWSLETTER_RATE_LIMITER: { limit: async () => ({ success: false }) },
      }),
    );

    expect(response.status).toBe(429);
  });

  it("reports success only after the provider accepts the address", async () => {
    const providerFetch = mock(() =>
      Promise.resolve(new Response(null, { status: 202 })),
    );
    globalThis.fetch = providerFetch as typeof fetch;
    const response = await POST(
      createContext(JSON.stringify({ email: " PERSON@Example.org " }), {
        NEWSLETTER_WEBHOOK_URL: "https://newsletter.example/subscribe",
        NEWSLETTER_WEBHOOK_TOKEN: "secret",
      }),
    );

    expect(response.status).toBe(200);
    expect(providerFetch).toHaveBeenCalledTimes(1);
    const init = providerFetch.mock.calls[0]?.[1] as RequestInit;
    expect(init.body).toBe(
      JSON.stringify({
        email: "person@example.org",
        source: "ethotechnics.org",
      }),
    );
    expect(new Headers(init.headers).get("Authorization")).toBe(
      "Bearer secret",
    );
  });
});
