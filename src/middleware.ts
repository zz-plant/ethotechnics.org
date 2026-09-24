import type { MiddlewareHandler } from "astro";

const COM_HOST_RE = /^(www\.)?ethotechnics\.com$/i;
// www.ethotechnics.org is a second name for the same site. Once its DNS record
// points at this Worker, it answers with a permanent redirect to the apex
// rather than serving a duplicate copy.
const WWW_ORG_HOST_RE = /^www\.ethotechnics\.org$/i;

const REDIRECT_MAP: Record<string, string> = {
  "/start-here": "/start",
  // Seven pages competed to be where a reader begins. Two remain: /method says
  // what this is, /start asks what you should do. The lenses and the four-step
  // sequence that lived on /how-it-works are sections of /method now.
  "/how-it-works": "/method",
  "/quick-start": "/start",
  // Three vocabularies answered "who are you": /start said engineer, /quick-start
  // said engineers, /adopt said build — and nothing linked to /adopt at all.
  // src/content/roles.ts is the union, deduplicated by who the reader actually
  // is. Every path that used to address an audience lands on that audience's
  // one page; roles.ts lists them as formerPaths and a test holds this map to
  // it.
  "/quick-start/engineers": "/roles/engineering",
  "/quick-start/policy-makers": "/roles/policy",
  "/quick-start/designers": "/roles/design",
  "/quick-start/researchers": "/roles/research",
  "/adopt": "/start",
  "/adopt/build": "/roles/engineering",
  "/adopt/ops": "/roles/operations",
  "/adopt/policy": "/roles/policy",
  "/roles": "/start",
  // /governance used to be two subjects behind one prefix: the institute's
  // process page at the root, and the taxonomy domain under every path below
  // it. Both now have a canonical home and /governance* is redirect-only.
  "/governance": "/institute/governance",
  // The six taxonomy domains route one way: under /taxonomy. Experience was
  // the last one still rendering at the top level.
  "/experience": "/taxonomy/experience",
  // One noun for the artifact family. The index was plural and the detail
  // pages singular, which is the only family on the site split that way.
  "/artifact": "/artifacts",
  // Two calculators that were their own top-level noun. They take numbers and
  // report a score, which is what the other instruments do.
  "/tools": "/diagnostics",
  "/tools/burden-budget-worksheet": "/diagnostics/burden-budget-worksheet",
  "/tools/governance-gap-score": "/diagnostics/governance-gap-score",
  // "Applications" was a third noun for operating patterns, which
  // /mechanisms/patterns already carries — kill switches, appeal paths,
  // progressive consent. Its index pointed mostly at explainers; its one page
  // of its own moved rather than being dropped.
  "/applications": "/mechanisms",
  "/applications/moral-circuit-breakers": "/mechanisms/moral-circuit-breakers",
  "/diy-packs": "/agent-toolkit/prompt-packs",
  "/bundles": "/agent-toolkit/prompt-packs",
  "/bundles/diagnostic-export-kit": "/agent-toolkit/prompt-packs",
  "/bundles/procurement-clause-pack": "/agent-toolkit/prompt-packs",
  "/bindings": "/agent-toolkit/prompt-packs",
  "/diagnostics/llm-capacity-benchmark": "/diagnostics",
  "/diagnostics/escalation-coverage-planner": "/diagnostics",
  "/diagnostics/evidence-pack-readiness": "/diagnostics",
  "/explainers/democratic-vs-coercive-governability":
    "/research/theory/democratic-vs-coercive-governability",
  // Two intake paths that predate /participate, kept for old inbound links.
  "/contact": "/participate",
  "/intake": "/participate",
  // /library was the mechanisms catalog's previous name. Its subpages moved
  // with it, except the diagnostics and validator views, which had already
  // become their own sections. These lived as one-line redirect pages under
  // src/pages/library until the sitemap, which lists every page file, listed
  // them too; a redirect is not a page.
  "/library": "/mechanisms",
  "/library/cite": "/mechanisms/cite",
  "/library/diagnostics": "/diagnostics",
  "/library/mechanisms-by-domain": "/mechanisms",
  "/library/validators-by-standard": "/validators",
  // The two "by-X" views re-cut a list the parent already shows whole: the
  // domain view carried a quarter of the mechanisms page's content and the
  // standard view a third of the validators page's, each reachable by one
  // link. Retired to the parent, which is where both links pointed anyway.
  "/mechanisms/by-domain": "/mechanisms",
  "/validators/by-standard": "/validators",
  // /institute/team promised "named stewards" four times over and named
  // nobody: four role titles and no people behind them. The page that does
  // carry stewardship — owners against decisions — is the governance process.
  "/institute/team": "/institute/governance",
  // /agents has one page, the spec. A bare hit on the directory 404ed.
  "/agents": "/agents/spec",
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
  if (
    normalizedPath === "/delivery" ||
    normalizedPath.startsWith("/delivery/")
  ) {
    const target = new URL(
      normalizedPath.replace(/^\/delivery/, "/taxonomy/delivery"),
      url.origin,
    );
    target.search = url.search;
    return target.toString();
  }
  if (
    normalizedPath === "/assurance" ||
    normalizedPath.startsWith("/assurance/")
  ) {
    const target = new URL(
      normalizedPath.replace(/^\/assurance/, "/taxonomy/assurance"),
      url.origin,
    );
    target.search = url.search;
    return target.toString();
  }
  if (
    normalizedPath.startsWith("/governance/") &&
    normalizedPath !== "/governance"
  ) {
    const target = new URL(
      normalizedPath.replace(/^\/governance/, "/taxonomy/governance"),
      url.origin,
    );
    target.search = url.search;
    return target.toString();
  }
  if (normalizedPath.startsWith("/experience/")) {
    const target = new URL(
      normalizedPath.replace(/^\/experience/, "/taxonomy/experience"),
      url.origin,
    );
    target.search = url.search;
    return target.toString();
  }
  // Pattern pages moved with the rest of the catalog from /library.
  if (normalizedPath.startsWith("/library/patterns/")) {
    const target = new URL(
      normalizedPath.replace(/^\/library\/patterns/, "/mechanisms/patterns"),
      url.origin,
    );
    target.search = url.search;
    return target.toString();
  }
  // The artifact detail pages were the singular half of a split family.
  if (normalizedPath.startsWith("/artifact/")) {
    const target = new URL(
      normalizedPath.replace(/^\/artifact/, "/artifacts"),
      url.origin,
    );
    target.search = url.search;
    return target.toString();
  }

  // Legacy versioned API snapshots
  if (normalizedPath.startsWith("/api/v/")) {
    const stripped = normalizedPath.replace(/^\/api\/v\/[^/]+/, "/api");
    const targetPath = stripped === "/api" ? "/api" : stripped;
    const target = new URL(targetPath, url.origin);
    target.search = url.search;
    return target.toString();
  }

  // Every page answered to two URLs: one with a trailing slash and one without,
  // each rendering in full and each naming itself canonical. Whichever form an
  // inbound link happens to use, the reader and the index land on the same one.
  if (normalizedPath !== url.pathname) {
    const target = new URL(normalizedPath, url.origin);
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

  if (host && (COM_HOST_RE.test(host) || WWW_ORG_HOST_RE.test(host))) {
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
