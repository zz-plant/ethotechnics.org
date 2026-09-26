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
      {
        url: "https://www.ethotechnics.org/glossary?foo=bar",
        host: "www.ethotechnics.org",
        expectedLocation: "https://ethotechnics.org/glossary?foo=bar",
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
        expectedLocation: "https://ethotechnics.org/agent-toolkit#prompts",
      },
      {
        url: "https://ethotechnics.org/bundles/procurement-clause-pack",
        expectedLocation: "https://ethotechnics.org/agent-toolkit#prompts",
      },
      {
        url: "https://ethotechnics.org/bindings",
        expectedLocation: "https://ethotechnics.org/agent-toolkit#prompts",
      },
      {
        url: "https://ethotechnics.org/incompatible",
        expectedLocation: "https://ethotechnics.org/method#incompatible",
      },
      {
        url: "https://ethotechnics.org/failure",
        expectedLocation: "https://ethotechnics.org/triage",
      },
      {
        url: "https://ethotechnics.org/failure/unauthorized-action",
        expectedLocation: "https://ethotechnics.org/triage/unauthorized-action",
      },
      {
        url: "https://ethotechnics.org/finite",
        expectedLocation: "https://ethotechnics.org/evals#finite",
      },
      {
        url: "https://ethotechnics.org/fast-path",
        expectedLocation: "https://ethotechnics.org/start#fast-path",
      },
      {
        url: "https://ethotechnics.org/syllabus",
        expectedLocation: "https://ethotechnics.org/mechanisms#syllabus",
      },
      {
        url: "https://ethotechnics.org/standards/implementation-examples",
        expectedLocation: "https://ethotechnics.org/examples#domains",
      },
      {
        url: "https://ethotechnics.org/standards/implementation-examples/loan-approval",
        expectedLocation: "https://ethotechnics.org/examples/loan-approval",
      },
      {
        url: "https://ethotechnics.org/standards/meta-critique",
        expectedLocation:
          "https://ethotechnics.org/standards#governance-by-control",
      },
      {
        url: "https://ethotechnics.org/standards/micro-diagram-language",
        expectedLocation: "https://ethotechnics.org/standards",
      },
      {
        url: "https://ethotechnics.org/agent-toolkit/prompt-packs",
        expectedLocation: "https://ethotechnics.org/agent-toolkit#prompts",
      },
      {
        url: "https://ethotechnics.org/agent-toolkit/agent-contract",
        expectedLocation: "https://ethotechnics.org/agent-toolkit#contract",
      },
      {
        url: "https://ethotechnics.org/agent-toolkit/faq",
        expectedLocation: "https://ethotechnics.org/agent-toolkit#quick-answers",
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
      {
        url: "https://ethotechnics.org/contact",
        expectedLocation: "https://ethotechnics.org/participate",
      },
      {
        url: "https://ethotechnics.org/library/",
        expectedLocation: "https://ethotechnics.org/mechanisms",
      },
      {
        url: "https://ethotechnics.org/library/validators-by-standard",
        expectedLocation: "https://ethotechnics.org/validators",
      },
      {
        url: "https://ethotechnics.org/library/patterns/kill-switch?tab=evidence",
        expectedLocation:
          "https://ethotechnics.org/mechanisms/patterns/kill-switch?tab=evidence",
      },
      // A trailing slash used to render the whole page a second time under a
      // second URL, each naming itself canonical.
      {
        url: "https://ethotechnics.org/standards/",
        expectedLocation: "https://ethotechnics.org/standards",
      },
      {
        url: "https://ethotechnics.org/glossary/stoppability/?from=nav",
        expectedLocation:
          "https://ethotechnics.org/glossary/stoppability?from=nav",
      },
      // One hop, not two, when a legacy path arrives with a slash as well.
      {
        url: "https://ethotechnics.org/delivery/intake/",
        expectedLocation: "https://ethotechnics.org/taxonomy/delivery/intake",
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
