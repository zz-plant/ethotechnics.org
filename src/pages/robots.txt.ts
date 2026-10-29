import type { APIContext } from "astro";

const fallbackSite = "https://ethotechnics.org";
const productionHosts = new Set(["ethotechnics.org", "www.ethotechnics.org"]);

// The Content Signals Policy declaration, verbatim from
// https://contentsignals.org so that any consumer reading robots.txt sees the
// vocabulary defined the same way every other site defines it.
const contentSignalsPolicy = `# As a condition of accessing this website, you agree to abide by the following content signals:

# (a) If a content-signal = yes, you may collect content for the corresponding use.
# (b) If a content-signal = no, you may not collect content for the corresponding use.
# (c) If the website operator does not include a content signal for a corresponding use, the website operator neither grants nor restricts permission via content signal with respect to the corresponding use.

# The content signals and their meanings are:

# search: building a search index and providing search results (e.g., returning hyperlinks and short excerpts from your website's contents). Search does not include providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models (e.g., retrieval augmented generation, grounding, or other real-time taking of content for generative AI search answers).
# ai-train: training or fine-tuning AI models.

# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.
`;

// All three signals are yes. The standards, mechanisms, and casebook are
// published under CC BY-SA 4.0, and the site ships a retrieval corpus
// (/api/rag-corpus.jsonl) and llms.txt for exactly these uses.
const contentSignalDirective =
  "Content-Signal: search=yes, ai-input=yes, ai-train=yes";

const buildRobots = (siteUrl: URL, allowIndexing: boolean) => {
  if (!allowIndexing) {
    return "User-agent: *\nDisallow: /\n";
  }

  const sitemapUrl = new URL("/sitemap.xml", siteUrl);

  // Shared diagnostic readouts are private-by-link: unlisted, noindex, and
  // not for crawlers.
  return `${contentSignalsPolicy}\nUser-agent: *\n${contentSignalDirective}\nAllow: /\nDisallow: /readouts/\nSitemap: ${sitemapUrl.toString()}\n`;
};

export function GET({ request, site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const requestHost = new URL(request.url).hostname;
  const allowIndexing = productionHosts.has(requestHost);

  return new Response(buildRobots(siteUrl, allowIndexing), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      ...(allowIndexing ? {} : { "X-Robots-Tag": "noindex, nofollow" }),
    },
  });
}
