import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, "src");
const pagesRoot = path.join(srcRoot, "pages");

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

const allAstroFiles = (await walk(srcRoot)).filter((file) =>
  file.endsWith(".astro"),
);
const pageAstroFiles = allAstroFiles.filter((file) =>
  file.startsWith(`${pagesRoot}${path.sep}`),
);
const astroFileSet = new Set(allAstroFiles);

const issues: string[] = [];
const warnings: string[] = [];
const headingPresenceCache = new Map<string, boolean>();
const sourceCache = new Map<string, string>();

interface AstroImport {
  componentName: string;
  resolvedPath: string;
}

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

const resolveAstroImportPath = (
  sourceFilePath: string,
  importPath: string,
): string | null => {
  if (!importPath.startsWith(".")) {
    return null;
  }

  const fileDir = path.dirname(sourceFilePath);
  const candidateBasePath = path.resolve(fileDir, importPath);
  const candidates = [
    candidateBasePath,
    `${candidateBasePath}.astro`,
    path.join(candidateBasePath, "index.astro"),
  ];

  for (const candidatePath of candidates) {
    if (candidatePath.endsWith(".astro") && astroFileSet.has(candidatePath)) {
      return candidatePath;
    }
  }

  return null;
};

const getComponentImports = (
  source: string,
  sourceFilePath: string,
): AstroImport[] => {
  const imports: AstroImport[] = [];
  const importPattern =
    /import\s+([A-Z][A-Za-z\d_]*)\s*(?:,\s*\{[^}]*\})?\s*from\s+["']([^"']+)["']/gms;

  for (const match of source.matchAll(importPattern)) {
    const componentName = match[1];
    const importPath = match[2];
    const resolvedPath = resolveAstroImportPath(sourceFilePath, importPath);

    if (!resolvedPath) {
      continue;
    }

    imports.push({ componentName, resolvedPath });
  }

  return imports;
};

const sourceContainsHeading = (source: string): boolean =>
  /<h1[\s>]/.test(source) || /<PageIntro[\s>]/.test(source);

const componentTagIsUsed = (source: string, componentName: string): boolean =>
  new RegExp(`<${componentName}[\\s>]`).test(source);

const readCachedSource = async (filePath: string): Promise<string> => {
  if (sourceCache.has(filePath)) {
    return sourceCache.get(filePath) ?? "";
  }

  const source = await readFile(filePath, "utf8");
  sourceCache.set(filePath, source);
  return source;
};

const hasHeadingInAstroFile = async (
  filePath: string,
  source: string,
  visited: Set<string> = new Set(),
): Promise<boolean> => {
  if (sourceContainsHeading(source)) {
    return true;
  }

  if (visited.has(filePath)) {
    return false;
  }

  if (headingPresenceCache.has(filePath)) {
    return headingPresenceCache.get(filePath) ?? false;
  }

  const nextVisited = new Set(visited);
  nextVisited.add(filePath);
  const imports = getComponentImports(source, filePath);

  for (const componentImport of imports) {
    if (!componentTagIsUsed(source, componentImport.componentName)) {
      continue;
    }

    const importedSource = await readCachedSource(componentImport.resolvedPath);
    const importedHasHeading = await hasHeadingInAstroFile(
      componentImport.resolvedPath,
      importedSource,
      nextVisited,
    );

    if (importedHasHeading) {
      headingPresenceCache.set(filePath, true);
      return true;
    }
  }

  headingPresenceCache.set(filePath, false);
  return false;
};

for (const filePath of pageAstroFiles) {
  const relPath = path.relative(repoRoot, filePath);
  const source = await readCachedSource(filePath);

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

  const hasHeading = await hasHeadingInAstroFile(filePath, source);
  if (!hasHeading) {
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

console.log(`SEO audit passed for ${pageAstroFiles.length} Astro page files.`);
