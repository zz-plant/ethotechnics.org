import type { MiddlewareHandler } from "astro";

const COM_HOST_RE = /^(www\.)?ethotechnics\.com$/i;

const REDIRECT_MAP: Record<string, string> = {
  "/diy-packs": "/agent-toolkit/prompt-packs",
  "/bundles": "/agent-toolkit/prompt-packs",
  "/bundles/diagnostic-export-kit": "/agent-toolkit/prompt-packs",
  "/bundles/procurement-clause-pack": "/agent-toolkit/prompt-packs",
  "/bindings": "/agent-toolkit/prompt-packs",
  "/diagnostics/llm-capacity-benchmark": "/diagnostics",
  "/diagnostics/escalation-coverage-planner": "/diagnostics",
  "/diagnostics/evidence-pack-readiness": "/diagnostics",
};

const resolveLegacyPathRedirect = (url: URL): string | null => {
  const normalizedPath = url.pathname.replace(/\/+$/, "") || "/";

  // Check direct lookup
  if (REDIRECT_MAP[normalizedPath]) {
    const target = new URL(REDIRECT_MAP[normalizedPath], url.origin);
    target.search = url.search;
    return target.toString();
  }

  // Taxonomy mirrors
  if (url.pathname === "/delivery" || url.pathname.startsWith("/delivery/")) {
    const target = new URL(url.pathname.replace(/^\/delivery/, "/taxonomy/delivery"), url.origin);
    target.search = url.search;
    return target.toString();
  }
  if (url.pathname === "/assurance" || url.pathname.startsWith("/assurance/")) {
    const target = new URL(url.pathname.replace(/^\/assurance/, "/taxonomy/assurance"), url.origin);
    target.search = url.search;
    return target.toString();
  }
  if (url.pathname.startsWith("/governance/") && url.pathname !== "/governance") {
    const target = new URL(url.pathname.replace(/^\/governance/, "/taxonomy/governance"), url.origin);
    target.search = url.search;
    return target.toString();
  }

  // Legacy versioned API snapshots
  if (url.pathname.startsWith("/api/v/")) {
    const stripped = url.pathname.replace(/^\/api\/v\/[^/]+/, "/api");
    const targetPath = stripped === "/api" || stripped === "/api/" ? "/api" : stripped;
    const target = new URL(targetPath, url.origin);
    target.search = url.search;
    return target.toString();
  }

  return null;
};

const applySecurityHeaders = (response: Response): Response => {
  const securityHeaders: Record<string, string> = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Permissions-Policy":
      "camera=(), geolocation=(), microphone=(), payment=()",
  };

  try {
    for (const [name, value] of Object.entries(securityHeaders)) {
      response.headers.set(name, value);
    }

    return response;
  } catch {
    return response;
  }
};

export const onRequest: MiddlewareHandler = async (context, next) => {
  const host = context.request.headers.get("host") ?? "";

  if (host && COM_HOST_RE.test(host)) {
    const url = new URL(context.request.url);
    url.hostname = "ethotechnics.org";
    url.host = "ethotechnics.org";

    const redirect = new Response(null, {
      status: 301,
      headers: { Location: url.toString() },
    });

    return applySecurityHeaders(redirect);
  }

  const url = new URL(context.request.url);
  const pathRedirect = resolveLegacyPathRedirect(url);
  if (pathRedirect) {
    const redirect = new Response(null, {
      status: 301,
      headers: { Location: pathRedirect },
    });
    return applySecurityHeaders(redirect);
  }

  const response = await next();
  return response ? applySecurityHeaders(response) : response;
};
