/**
 * Fails when a page exists that nobody can click their way to.
 *
 * The site reached 23 unreachable static routes out of 89 without anyone
 * noticing, because nothing was watching. Two of them — /fast-path and /finite
 * — had been argued for and kept in an IA refactor on the grounds that they
 * served a real audience, and were then unreachable, which made that argument
 * untestable. One of them, /mechanisms/moral-circuit-breakers, was orphaned by
 * the very commit that moved it somewhere more sensible.
 *
 * A route that nothing links to is not necessarily wrong — a 404 page, a
 * component gallery, a machine-readable surface, a redirect kept for old
 * inbound links. But it should be a decision someone made on purpose, which is
 * what the allowlist below records. Anything else is an accident.
 *
 * Run against a built site: bun run scripts/check-reachability.ts <baseUrl>
 */

import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const BASE = process.argv[2] ?? "http://127.0.0.1:4321";
const PAGES_DIR = "src/pages";
const MAX_PAGES = 2000;

/**
 * Routes that are unreachable on purpose, each with the reason. Adding a line
 * here is the way to say "yes, deliberately" — and having to write the reason
 * is the point.
 */
const INTENTIONALLY_UNLINKED = new Map<string, string>([
  ["/404", "the error page; reached by failing to find something else"],
  ["/components-preview", "a development gallery, not site content"],
  ["/agents/spec", "a machine surface, cited by llms.txt rather than linked"],
  ["/intake", "a redirect kept for old inbound links"],
  ["/contact", "a redirect to /participate, kept for old inbound links"],
  ["/library", "a redirect to /mechanisms, kept for old inbound links"],
  ["/library/cite", "a redirect kept for old inbound links"],
  ["/library/mechanisms-by-domain", "a redirect kept for old inbound links"],
  ["/library/validators-by-standard", "a redirect kept for old inbound links"],
  ["/library/diagnostics", "a redirect kept for old inbound links"],
]);

const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

/** Every static route the filesystem defines. Dynamic routes are out of scope. */
async function staticRoutes(): Promise<string[]> {
  const routes: string[] = [];
  async function walk(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.name.endsWith(".astro")) {
        const rel = relative(PAGES_DIR, full).replace(/\.astro$/, "");
        if (rel.includes("[")) continue;
        routes.push(normalize("/" + rel.replace(/\/?index$/, "")));
      }
    }
  }
  await walk(PAGES_DIR);
  return [...new Set(routes)];
}

/** Follow links from the homepage and record what a reader can actually reach. */
async function crawl(): Promise<Set<string>> {
  const seen = new Set<string>();
  const reachable = new Set<string>();
  const queue = ["/"];

  while (queue.length > 0 && seen.size < MAX_PAGES) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);

    let response: Response;
    try {
      response = await fetch(BASE + path, { redirect: "follow" });
    } catch {
      continue;
    }
    if (!response.ok) continue;
    reachable.add(normalize(new URL(response.url).pathname));

    const html = await response.text();
    for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const href = normalize(match[1]!);
      if (href.startsWith("/_astro") || href.startsWith("/assets")) continue;
      if (!seen.has(href)) queue.push(href);
    }
  }
  return reachable;
}

const routes = await staticRoutes();
const reachable = await crawl();

const orphans = routes.filter(
  (route) => !reachable.has(route) && !INTENTIONALLY_UNLINKED.has(route),
);
const staleAllowances = [...INTENTIONALLY_UNLINKED.keys()].filter(
  (route) => !routes.includes(route),
);

if (orphans.length > 0) {
  console.error(
    `Reachability check failed: ${orphans.length} of ${routes.length} static routes cannot be reached by clicking from the homepage.\n`,
  );
  for (const orphan of orphans) console.error(`  - ${orphan}`);
  console.error(
    "\nLink each from wherever it belongs, or add it to INTENTIONALLY_UNLINKED " +
      "in scripts/check-reachability.ts with the reason it is unreachable on purpose.",
  );
  process.exit(1);
}

if (staleAllowances.length > 0) {
  console.error(
    `Reachability check failed: ${staleAllowances.length} allowlist entries name routes that no longer exist.\n`,
  );
  for (const stale of staleAllowances) console.error(`  - ${stale}`);
  process.exit(1);
}

console.log(
  `Reachability check passed; all ${routes.length - INTENTIONALLY_UNLINKED.size} linkable static routes are reachable from the homepage.`,
);
