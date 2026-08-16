import { describe, expect, it, mock } from "bun:test";
import type { APIContext } from "astro";

import { onRequest } from "./middleware";

describe("middleware", () => {
  it("redirects ethotechnics.com variants to ethotechnics.org", async () => {
    const redirectCases = [
      {
        url: "https://ethotechnics.com/path?foo=bar",
        host: "ethotechnics.com",
        expectedLocation: "https://ethotechnics.org/path?foo=bar",
      },
      {
        url: "https://www.ethotechnics.com/with-www?foo=bar",
        host: "www.ethotechnics.com",
        expectedLocation: "https://ethotechnics.org/with-www?foo=bar",
      },
      {
        url: "https://www.ethotechnics.com/mixed?foo=bar",
        host: "WWw.EthoTechnics.Com",
        expectedLocation: "https://ethotechnics.org/mixed?foo=bar",
      },
    ];

    for (const { url, host, expectedLocation } of redirectCases) {
      const request = new Request(url);
      // Bun's Request constructor strips the forbidden Host header,
      // so patch headers.get to return the test host value.
      const originalGet = request.headers.get.bind(request.headers);
      request.headers.get = (key: string) =>
        key.toLowerCase() === "host" ? host : originalGet(key);
      const next = mock(() => Promise.resolve(new Response("next")));

      const response = await onRequest(
        { request, locals: {} as App.Locals } as APIContext,
        next,
      );

      if (!response) {
        throw new Error("Expected redirect response");
      }

      expect(response.status).toBe(301);
      expect(response.headers.get("Location")).toBe(expectedLocation);
      expect(response.headers.get("Strict-Transport-Security")).toContain(
        "max-age",
      );
      expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(response.headers.get("Permissions-Policy")).toBe(
        "camera=(), geolocation=(), microphone=(), payment=()",
      );
      expect(next).not.toHaveBeenCalled();
    }
  });

  it("skips redirects when host header is missing or empty", async () => {
    const cases: Array<HeadersInit | undefined> = [undefined, { host: "" }];

    for (const headers of cases) {
      const request = new Request("https://example.com/path", { headers });
      const next = mock(() => Promise.resolve(new Response("next")));

      const response = await onRequest(
        { request, locals: {} as App.Locals } as APIContext,
        next,
      );

      if (!response) {
        throw new Error("Expected next response");
      }

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("next");
      expect(response.headers.get("Strict-Transport-Security")).toContain(
        "max-age",
      );
      expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(response.headers.get("Permissions-Policy")).toBe(
        "camera=(), geolocation=(), microphone=(), payment=()",
      );
      expect(next).toHaveBeenCalledTimes(1);
    }
  });
});
