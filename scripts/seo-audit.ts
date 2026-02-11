import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const pagesRoot = path.join(repoRoot, "src", "pages");

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      return fullPath;
    }),
  );

  return files.flat();
};

const astroFiles = (await walk(pagesRoot)).filter((file) =>
  file.endsWith(".astro"),
);

const issues: string[] = [];
const warnings: string[] = [];

const isInternalHref = (href: string): boolean => {
  const trimmedHref = href.trim();

  if (!trimmedHref || trimmedHref.startsWith("//")) {
    return false;
  }

  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmedHref)) {
    return false;
  }

  return (
    trimmedHref.startsWith("/") ||
    trimmedHref.startsWith("#") ||
    trimmedHref.startsWith("./") ||
    trimmedHref.startsWith("../")
  );
};

const countInternalLinks = (source: string): number => {
  const hrefPattern =
    /href\s*=\s*("([^"]*)"|'([^']*)'|\{\s*`([^`]*)`\s*\}|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\})/g;

  return [...source.matchAll(hrefPattern)].reduce((count, match) => {
    const hrefValue =
      match[2] ?? match[3] ?? match[4] ?? match[5] ?? match[6] ?? "";

    if (hrefValue.includes("${")) {
      return count;
    }

    return isInternalHref(hrefValue) ? count + 1 : count;
  }, 0);
};

for (const filePath of astroFiles) {
  const relPath = path.relative(repoRoot, filePath);
  const source = await readFile(filePath, "utf8");

  const usesBaseLayout = /<BaseLayout[\s\S]*?>/.test(source);
  if (!usesBaseLayout) continue;

  const hasTitleProp = /<BaseLayout[\s\S]*?\btitle=/.test(source);
  const hasDescriptionProp = /<BaseLayout[\s\S]*?\bdescription=/.test(source);

  if (!hasTitleProp) {
    issues.push(`${relPath}: BaseLayout is missing a title prop.`);
  }

  if (!hasDescriptionProp) {
    issues.push(`${relPath}: BaseLayout is missing a description prop.`);
  }

  const hasH1 = /<h1[\s>]/.test(source);
  const usesPageIntro = /<PageIntro[\s>]/.test(source);
  if (!hasH1 && !usesPageIntro) {
    issues.push(
      `${relPath}: page is missing an <h1> or PageIntro heading component.`,
    );
  }

  const lineCount = source.split("\n").length;
  const internalLinks = countInternalLinks(source);
  if (lineCount >= 120 && internalLinks < 3) {
    warnings.push(
      `${relPath}: long page has only ${internalLinks} internal links; consider adding descriptive internal links.`,
    );
  }
}

if (issues.length > 0) {
  console.error("SEO audit failed:\n");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.log("SEO audit warnings:\n");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

console.log(`SEO audit passed for ${astroFiles.length} Astro page files.`);
