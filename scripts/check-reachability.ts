/**
 * Fails when a page exists that nobody can click their way to, or when a link
 * leads to a page that does not exist.
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
 * The other direction went unwatched for longer. A migration removed 24
 * standards pages without removing the links to them, and for five weeks the
 * /standards hub carried 22 links that answered 404 — plus 50 more across the
 * site, to glossary terms that were tags, and to sections that never existed.
 * This crawl already requests every internal link; it now records what each
 * one answered and fails on anything that is not a page.
 *
 * A link can answer 200 and still land nowhere. 1442 links across the site
 * named a fragment no page carried — glossary cross-references left behind
 * when the glossary split into one page per term, a nav item pointing at a
 * section that had moved to its own page, and links into a page that was
 * retired. The crawl reads every id it renders, so it checks those too.
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

/** What one link answered: its final status, and whether it got there by redirect. */
type LinkOutcome = { status: number; redirected: boolean };

/** A link that named a section: where it came from, and what it asked for. */
type FragmentLink = { from: string; to: string; fragment: string };

type Crawl = {
  reachable: Set<string>;
  outcomes: Map<string, LinkOutcome>;
  linkedFrom: Map<string, Set<string>>;
  ids: Map<string, Set<string>>;
  fragmentLinks: FragmentLink[];
};

/** Follow links from the homepage and record what a reader can actually reach. */
async function crawl(): Promise<Crawl> {
  const seen = new Set<string>();
  const reachable = new Set<string>();
  const outcomes = new Map<string, LinkOutcome>();
  const linkedFrom = new Map<string, Set<string>>();
  const ids = new Map<string, Set<string>>();
  const fragmentLinks: FragmentLink[] = [];
  const queue = ["/"];

  while (queue.length > 0 && seen.size < MAX_PAGES) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);

    let response: Response;
    try {
      response = await fetch(BASE + path, { redirect: "follow" });
    } catch {
      outcomes.set(path, { status: -1, redirected: false });
      continue;
    }
    outcomes.set(path, {
      status: response.status,
      redirected: response.redirected,
    });
    if (!response.ok) continue;
    reachable.add(normalize(new URL(response.url).pathname));

    const html = await response.text();
    ids.set(
      path,
      new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]!)),
    );
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const value = match[1]!;
      if (!value.startsWith("/") && !value.startsWith("#")) continue;
      const [target, fragment] = value.split("#");
      if (!fragment || fragment === "top") continue;
      const to = normalize((target === "" ? path : target).split("?")[0]!);
      if (to.startsWith("/_astro") || to.startsWith("/assets")) continue;
      fragmentLinks.push({ from: path, to, fragment });
    }
    for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const href = normalize(match[1]!);
      if (href.startsWith("/_astro") || href.startsWith("/assets")) continue;
      if (!linkedFrom.has(href)) linkedFrom.set(href, new Set());
      linkedFrom.get(href)!.add(path);
      if (!seen.has(href)) queue.push(href);
    }
  }
  return { reachable, outcomes, linkedFrom, ids, fragmentLinks };
}

const routes = await staticRoutes();
const { reachable, outcomes, linkedFrom, ids, fragmentLinks } = await crawl();

const orphans = routes.filter(
  (route) => !reachable.has(route) && !INTENTIONALLY_UNLINKED.has(route),
);
const staleAllowances = [...INTENTIONALLY_UNLINKED.keys()].filter(
  (route) => !routes.includes(route),
);
const brokenLinks = [...outcomes.entries()]
  .filter(([, outcome]) => outcome.status !== 200)
  .sort(([a], [b]) => a.localeCompare(b));
const redirectedLinks = [...outcomes.entries()]
  .filter(([, outcome]) => outcome.status === 200 && outcome.redirected)
  .map(([path]) => path)
  .sort();

const describeSources = (path: string) => {
  const sources = [...(linkedFrom.get(path) ?? [])].sort();
  const shown = sources.slice(0, 3).join(", ");
  const more = sources.length > 3 ? `, +${sources.length - 3} more` : "";
  return `${sources.length} page${sources.length === 1 ? "" : "s"}: ${shown}${more}`;
};

if (brokenLinks.length > 0) {
  console.error(
    `Reachability check failed: ${brokenLinks.length} internal links lead to something that is not a page.\n`,
  );
  for (const [path, outcome] of brokenLinks) {
    const status = outcome.status === -1 ? "no response" : outcome.status;
    console.error(`  - ${status}  ${path}  <- ${describeSources(path)}`);
  }
  console.error(
    "\nRestore the page, point the link at the page that replaced it, or drop the link.",
  );
  process.exit(1);
}

// Only pages the crawl actually rendered can be checked; a link into a
// redirect lands on a path the crawl recorded under its destination.
const brokenFragments = fragmentLinks
  .filter(({ to, fragment }) => {
    const rendered = ids.get(to);
    return rendered !== undefined && !rendered.has(fragment);
  })
  .sort((a, b) =>
    `${a.to}#${a.fragment}`.localeCompare(`${b.to}#${b.fragment}`),
  );

if (brokenFragments.length > 0) {
  const byTarget = new Map<string, string[]>();
  for (const { from, to, fragment } of brokenFragments) {
    const key = `${to}#${fragment}`;
    byTarget.set(key, [...(byTarget.get(key) ?? []), from]);
  }
  console.error(
    `Reachability check failed: ${brokenFragments.length} links name a section that the page does not have.\n`,
  );
  for (const [target, sources] of byTarget) {
    const shown = [...new Set(sources)].sort().slice(0, 3).join(", ");
    console.error(`  - ${target}  <- ${sources.length} link(s): ${shown}`);
  }
  console.error(
    "\nGive the page that section, point the link at the page that has it, or drop the fragment.",
  );
  process.exit(1);
}

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

if (redirectedLinks.length > 0) {
  // Not a failure: the reader arrives. But each is a link that could name
  // its destination, and the list is where a retired path shows up first.
  console.log(
    `${redirectedLinks.length} linked paths answer through a redirect; each works, and could link its target directly:`,
  );
  for (const path of redirectedLinks) {
    console.log(`  - ${path}  <- ${describeSources(path)}`);
  }
}

console.log(
  `Reachability check passed; all ${routes.length - INTENTIONALLY_UNLINKED.size} linkable static routes are reachable from the homepage, and all ${outcomes.size} internal links lead to a page, ${fragmentLinks.length} of them to a section that exists.`,
);
