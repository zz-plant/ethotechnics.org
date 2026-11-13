/**
 * The date each static page last changed, from git, for the sitemap's
 * <lastmod> and the page's dateModified.
 *
 * Most page files set a publishedTime and no modifiedTime, so every edit
 * after launch left both dates where they started: /method said 2026-09-06
 * on the day #1124 rewrote it. A page's text often lives in the content
 * module it imports, so the date is the latest commit to the page file or to
 * a file it imports from src/content or src/data. Imports of components,
 * layouts, and utilities don't count: they are shared, and a footer edit
 * doesn't change what a page says.
 *
 * This runs in Node, inside Vite, at build and dev-server start. The Worker
 * gets the finished map as a virtual module and never calls git.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, posix, relative, sep } from "node:path";

import { walkFiles } from "./walk";

const VIRTUAL_ID = "virtual:page-dates";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const CONTENT_DIRS = ["src/content/", "src/data/"];
const IMPORT_EXTENSIONS = ["", ".ts", ".tsx", ".js", ".mjs", ".json", ".mdx"];

/** Latest commit date per file, from `git log --format=%x1e%cI --name-only`. */
export const parseGitLog = (output: string): Map<string, string> => {
  const dates = new Map<string, string>();
  for (const record of output.split("\x1e")) {
    const [date, ...files] = record
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!date) continue;
    // git log lists newest first, so the first date seen for a file is its last.
    for (const file of files) if (!dates.has(file)) dates.set(file, date);
  }
  return dates;
};

/** The URL a page file serves, or null for dynamic and private routes. */
export const routeForPage = (file: string): string | null => {
  const route = file.replace(/^src\/pages\//, "").replace(/\.astro$/, "");
  if (route.includes("[")) return null;
  if (route.split("/").some((segment) => segment.startsWith("_"))) return null;
  if (route === "index") return "/";
  if (route.endsWith("/index")) return `/${route.slice(0, -6)}`;
  return `/${route}`;
};

/** Files under src/content or src/data that a source file imports directly. */
export const contentImports = (
  file: string,
  source: string,
  exists: (path: string) => boolean = existsSync,
): string[] => {
  const specifiers = [
    ...source.matchAll(/(?:from|import)\s+["']([^"']+)["']/g),
  ].map((match) => match[1] ?? "");
  const files = new Set<string>();
  for (const specifier of specifiers) {
    let base: string;
    if (specifier.startsWith(".")) {
      base = posix.join(posix.dirname(file), specifier);
    } else if (specifier.startsWith("@/")) {
      base = `src/${specifier.slice(2)}`;
    } else {
      continue;
    }
    if (!CONTENT_DIRS.some((dir) => base.startsWith(dir))) continue;
    const candidates = [
      ...IMPORT_EXTENSIONS.map((ext) => `${base}${ext}`),
      `${base}/index.ts`,
    ];
    const found = candidates.find((candidate) => exists(candidate));
    if (found) files.add(found);
  }
  return [...files];
};

const latest = (dates: Array<string | undefined>): string | undefined =>
  dates
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0]
    ?.toISOString();

/** Route → ISO date of the latest commit to the page or its content. */
export const buildPageDates = (
  pageFiles: string[],
  commitDates: Map<string, string>,
  read: (path: string) => string,
  exists?: (path: string) => boolean,
): Record<string, string> => {
  const pageDates: Record<string, string> = {};
  for (const file of pageFiles) {
    const route = routeForPage(file);
    if (!route) continue;
    const sources = [file, ...contentImports(file, read(file), exists)];
    const date = latest(sources.map((source) => commitDates.get(source)));
    if (date) pageDates[route] = date;
  }
  return pageDates;
};

const git = (root: string, args: string[]) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120_000,
  }).trim();

/**
 * A shallow clone knows only its newest commit, which would date every page
 * today. Fetch the rest of the history; if that fails, return false and let
 * pages keep the dates they set by hand.
 */
const hasFullHistory = (root: string): boolean => {
  try {
    if (git(root, ["rev-parse", "--is-shallow-repository"]) !== "true") {
      return true;
    }
    git(root, ["fetch", "--unshallow", "--quiet"]);
    return git(root, ["rev-parse", "--is-shallow-repository"]) !== "true";
  } catch {
    return false;
  }
};

export const readPageDates = async (
  root: string,
): Promise<Record<string, string>> => {
  if (!hasFullHistory(root)) {
    console.warn(
      "[page-dates] No full git history; pages keep their hand-set dates.",
    );
    return {};
  }
  const log = git(root, [
    "log",
    "--format=%x1e%cI",
    "--name-only",
    "--",
    "src/pages",
    ...CONTENT_DIRS,
  ]);
  const pageFiles = (await walkFiles(join(root, "src/pages"), [".astro"])).map(
    (file) => relative(root, file).split(sep).join("/"),
  );
  return buildPageDates(
    pageFiles,
    parseGitLog(log),
    (path) => readFileSync(join(root, path), "utf8"),
    (path) => existsSync(join(root, path)),
  );
};

/** Vite plugin serving `virtual:page-dates` as `{ [route]: isoDate }`. */
export const pageDatesPlugin = (root: string) => {
  let code: Promise<string> | undefined;
  return {
    name: "ethotechnics:page-dates",
    resolveId(id: string) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    load(id: string) {
      if (id !== RESOLVED_ID) return undefined;
      code ??= readPageDates(root).then(
        (dates) => `export default ${JSON.stringify(dates)};`,
      );
      return code;
    },
  };
};
