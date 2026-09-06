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
      expect(response.headers.get("Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin",
      );
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
      expect(response.headers.get("Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin",
      );
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(response.headers.get("Permissions-Policy")).toBe(
        "camera=(), geolocation=(), microphone=(), payment=()",
      );
      expect(next).toHaveBeenCalledTimes(1);
    }
  });

  it("redirects legacy and consolidated paths with 301", async () => {
    const pathCases = [
      {
        url: "https://ethotechnics.org/diy-packs",
        expectedLocation: "https://ethotechnics.org/agent-toolkit/prompt-packs",
      },
      {
        url: "https://ethotechnics.org/bundles/procurement-clause-pack",
        expectedLocation: "https://ethotechnics.org/agent-toolkit/prompt-packs",
      },
      {
        url: "https://ethotechnics.org/bindings",
        expectedLocation: "https://ethotechnics.org/agent-toolkit/prompt-packs",
      },
      {
        url: "https://ethotechnics.org/delivery/intake",
        expectedLocation: "https://ethotechnics.org/taxonomy/delivery/intake",
      },
      {
        url: "https://ethotechnics.org/assurance/monitoring",
        expectedLocation:
          "https://ethotechnics.org/taxonomy/assurance/monitoring",
      },
      {
        url: "https://ethotechnics.org/governance/policy",
        expectedLocation: "https://ethotechnics.org/taxonomy/governance/policy",
      },
      {
        url: "https://ethotechnics.org/diagnostics/llm-capacity-benchmark",
        expectedLocation: "https://ethotechnics.org/diagnostics",
      },
      {
        url: "https://ethotechnics.org/api/v/2026.01/glossary.json",
        expectedLocation: "https://ethotechnics.org/api/glossary.json",
      },
      {
        url: "https://ethotechnics.org/start-here",
        expectedLocation: "https://ethotechnics.org/start",
      },
      {
        url: "https://ethotechnics.org/start-here/",
        expectedLocation: "https://ethotechnics.org/start",
      },
      {
        url: "https://ethotechnics.org/explainers/democratic-vs-coercive-governability",
        expectedLocation:
          "https://ethotechnics.org/research/theory/democratic-vs-coercive-governability",
      },
    ];

    for (const { url, expectedLocation } of pathCases) {
      const request = new Request(url);
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
      expect(next).not.toHaveBeenCalled();
    }
  });
});
