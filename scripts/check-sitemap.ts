/**
 * Fails when a sitemap advertises a URL the site does not serve.
 *
 * The section sitemaps reached 104 URLs that did not answer 200 without anyone
 * noticing: 67 glossary slugs with a tooltip definition but no page, 30
 * taxonomy and pattern paths the middleware redirects elsewhere, and 7 redirect
 * stubs that counted as pages because they were files under src/pages. Before
 * that, four standards and seven crosswalk controls were listed from a registry
 * whose pages had been removed. Nothing caught any of it, because the sitemap
 * was assembled from content data and checked against nothing.
 *
 * src/utils/seo/sitemaps.ts now derives every section from what the routes
 * resolve, and this holds it to that: fetch the index, fetch each section,
 * request every <loc>, and require 200. A redirect fails too — a crawler asked
 * to index a URL should not be sent somewhere else.
 *
 * Run against a built site: bun run scripts/check-sitemap.ts <baseUrl>
 */

import { baseUrlArg, crash, fail } from "./lib/cli";
import { fetchStatus, pool } from "./lib/net";

const BASE = baseUrlArg();
const CONCURRENCY = 8;

type Probe = { section: string; path: string; status: number };

const locs = (xml: string): string[] =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]!.trim());

/** The path a <loc> names, whatever host the sitemap was rendered for. */
const pathOf = (loc: string) => {
  const url = new URL(loc);
  return `${url.pathname}${url.search}`;
};

async function probeAll(section: string, paths: string[]): Promise<Probe[]> {
  const statuses = await pool(paths, CONCURRENCY, (path) =>
    fetchStatus(BASE + path),
  );
  return paths.map((path, index) => ({
    section,
    path,
    status: statuses[index]!,
  }));
}

async function main(): Promise<void> {
  const index = await fetch(`${BASE}/sitemap.xml`);
  if (!index.ok) {
    fail(`Sitemap check failed: /sitemap.xml answered ${index.status}.`);
  }

  const sectionPaths = locs(await index.text()).map(pathOf);
  if (sectionPaths.length === 0) {
    fail("Sitemap check failed: /sitemap.xml lists no section sitemaps.");
  }

  const failures: Probe[] = [];
  let checked = 0;

  for (const sectionPath of sectionPaths) {
    const response = await fetch(BASE + sectionPath);
    if (!response.ok) {
      fail(`Sitemap check failed: ${sectionPath} answered ${response.status}.`);
    }

    const paths = locs(await response.text()).map(pathOf);
    // An empty section is how the core sitemap failed once: the page glob was
    // guarded on a condition that is false in the built Worker, and the file
    // was valid XML listing nothing.
    if (paths.length === 0) {
      fail(`Sitemap check failed: ${sectionPath} lists no URLs.`);
    }

    const results = await probeAll(sectionPath, paths);
    checked += results.length;
    failures.push(...results.filter((result) => result.status !== 200));
  }

  if (failures.length > 0) {
    console.error(
      `Sitemap check failed: ${failures.length} of ${checked} listed URLs do not answer 200.\n`,
    );
    for (const { section, path, status } of failures) {
      const shown = status === -1 ? "no response" : String(status);
      console.error(`  - ${shown}  ${path}  (${section})`);
    }
    console.error(
      "\nEither give each a page or stop listing it: src/utils/seo/sitemaps.ts must " +
        "derive every section from what the routes resolve.",
    );
    process.exit(1);
  }

  console.log(
    `Sitemap check passed; all ${checked} URLs across ${sectionPaths.length} section sitemaps answer 200.`,
  );
}

main().catch(crash);
