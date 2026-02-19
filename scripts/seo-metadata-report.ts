import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PAGES_ROOT = path.resolve("src/pages");
const OUTPUT_PATH = path.resolve("docs/seo-metadata-report.md");

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const resolved = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(resolved);
      }
      return entry.isFile() ? [resolved] : [];
    }),
  );
  return files.flat();
};

const REDIRECT_MARKER = "Astro.redirect(";

type LayoutComponent = {
  component: string;
  requiredProps: string[];
};

const LAYOUT_COMPONENTS: LayoutComponent[] = [
  { component: "BaseLayout", requiredProps: ["title", "description"] },
  { component: "ExplainerLayout", requiredProps: ["title", "description"] },
  { component: "TaxonomyEntryPage", requiredProps: [] },
];

const findImportedAlias = (content: string, component: string) => {
  const importMatch = content.match(
    new RegExp(
      `import\\s+(\\w+)\\s+from\\s+["'][^"']*${component}\\.astro["']`,
    ),
  );
  return importMatch?.[1] ?? null;
};

const findLayoutUsage = (content: string) => {
  for (const layout of LAYOUT_COMPONENTS) {
    const alias = findImportedAlias(content, layout.component);
    if (!alias) {
      continue;
    }
    const tagMatch = content.match(
      new RegExp(`<${alias}(\\s|>|\\n)[\\s\\S]*?>`),
    );
    if (tagMatch) {
      return { layout, alias, tag: tagMatch[0] };
    }
  }
  return null;
};

const formatMissing = (missingTitle: boolean, missingDescription: boolean) => {
  const missing = [] as string[];
  if (missingTitle) missing.push("title");
  if (missingDescription) missing.push("description");
  return missing.join(" + ");
};

const findLiteralPropValue = (tag: string, propName: string): string | null => {
  const match = new RegExp(`\\b${propName}=(["'])([^"']*)\\1`).exec(tag);
  return match?.[2]?.trim() || null;
};

const isLikelyArticleRoute = (relativePath: string): boolean =>
  !relativePath.endsWith("/index.astro") &&
  !relativePath.endsWith("/404.astro") &&
  !relativePath.includes("/[...") &&
  !relativePath.includes("/[");

const run = async () => {
  const files = await walk(PAGES_ROOT);
  const astroFiles = files.filter(
    (file) =>
      file.endsWith(".astro") && !file.includes(`${path.sep}api${path.sep}`),
  );
  const missingEntries: Array<{ file: string; missing: string }> = [];
  const pagesWithoutBaseLayout: string[] = [];
  const titleToPages = new Map<string, string[]>();
  const descriptionToPages = new Map<string, string[]>();
  const shortTitlePages: Array<{
    file: string;
    length: number;
    value: string;
  }> = [];
  const shortDescriptionPages: Array<{
    file: string;
    length: number;
    value: string;
  }> = [];
  const likelyArticleMissingPublishedTime: string[] = [];

  for (const file of astroFiles) {
    const content = await readFile(file, "utf-8");
    if (content.includes(REDIRECT_MARKER)) {
      continue;
    }

    const layoutUsage = findLayoutUsage(content);
    if (!layoutUsage) {
      pagesWithoutBaseLayout.push(file);
      continue;
    }

    const { layout, tag } = layoutUsage;
    const missingTitle =
      layout.requiredProps.includes("title") && !/\btitle=/.test(tag);
    const missingDescription =
      layout.requiredProps.includes("description") &&
      !/\bdescription=/.test(tag);

    const relativeFile = path.relative(path.resolve("."), file);
    const literalTitle = findLiteralPropValue(tag, "title");
    const literalDescription = findLiteralPropValue(tag, "description");

    if (literalTitle) {
      titleToPages.set(literalTitle, [
        ...(titleToPages.get(literalTitle) ?? []),
        relativeFile,
      ]);
      if (literalTitle.length < 35) {
        shortTitlePages.push({
          file: relativeFile,
          length: literalTitle.length,
          value: literalTitle,
        });
      }
    }

    if (literalDescription) {
      descriptionToPages.set(literalDescription, [
        ...(descriptionToPages.get(literalDescription) ?? []),
        relativeFile,
      ]);
      if (literalDescription.length < 70) {
        shortDescriptionPages.push({
          file: relativeFile,
          length: literalDescription.length,
          value: literalDescription,
        });
      }
    }

    if (isLikelyArticleRoute(relativeFile) && !/\bpublishedTime=/.test(tag)) {
      likelyArticleMissingPublishedTime.push(relativeFile);
    }

    if (missingTitle || missingDescription) {
      missingEntries.push({
        file,
        missing: formatMissing(missingTitle, missingDescription),
      });
    }
  }

  const sortedMissing = missingEntries.sort((a, b) =>
    a.file.localeCompare(b.file),
  );
  const sortedWithoutLayout = pagesWithoutBaseLayout.sort();
  const duplicateTitles = [...titleToPages.entries()]
    .filter(([, pages]) => pages.length > 1)
    .sort((a, b) => a[0].localeCompare(b[0]));
  const duplicateDescriptions = [...descriptionToPages.entries()]
    .filter(([, pages]) => pages.length > 1)
    .sort((a, b) => a[0].localeCompare(b[0]));
  const generatedAt = new Date().toISOString();

  const lines = [
    "# SEO metadata report",
    "",
    `Generated: ${generatedAt}`,
    "",
    "## Pages missing BaseLayout title/description props",
    "",
    "| Page | Missing |",
    "| --- | --- |",
    ...sortedMissing.map((entry) => {
      const relative = path.relative(path.resolve("."), entry.file);
      return `| \`${relative}\` | ${entry.missing} |`;
    }),
    "",
    "## Pages without BaseLayout usage",
    "",
    ...sortedWithoutLayout.map((file) => {
      const relative = path.relative(path.resolve("."), file);
      return `- \`${relative}\``;
    }),
    "",
    "## Duplicate literal titles",
    "",
    ...(duplicateTitles.length > 0
      ? duplicateTitles.map(
          ([title, pages]) =>
            `- \`${title}\` → ${pages.map((page) => `\`${page}\``).join(", ")}`,
        )
      : ["- None"]),
    "",
    "## Duplicate literal descriptions",
    "",
    ...(duplicateDescriptions.length > 0
      ? duplicateDescriptions.map(
          ([description, pages]) =>
            `- \`${description}\` → ${pages.map((page) => `\`${page}\``).join(", ")}`,
        )
      : ["- None"]),
    "",
    "## Pages with short literal titles (<35 chars)",
    "",
    ...(shortTitlePages.length > 0
      ? shortTitlePages
          .sort((a, b) => a.file.localeCompare(b.file))
          .map(
            (entry) => `- \`${entry.file}\` (${entry.length}) — ${entry.value}`,
          )
      : ["- None"]),
    "",
    "## Pages with short literal descriptions (<70 chars)",
    "",
    ...(shortDescriptionPages.length > 0
      ? shortDescriptionPages
          .sort((a, b) => a.file.localeCompare(b.file))
          .map(
            (entry) => `- \`${entry.file}\` (${entry.length}) — ${entry.value}`,
          )
      : ["- None"]),
    "",
    "## Likely article routes missing publishedTime",
    "",
    ...(likelyArticleMissingPublishedTime.length > 0
      ? likelyArticleMissingPublishedTime.sort().map((file) => `- \`${file}\``)
      : ["- None"]),
    "",
  ];

  await writeFile(OUTPUT_PATH, lines.join("\n"));
  console.log(`Wrote ${path.relative(path.resolve("."), OUTPUT_PATH)}`);
};

await run();
