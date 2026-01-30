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
    })
  );
  return files.flat();
};

const formatMissing = (missingTitle: boolean, missingDescription: boolean) => {
  const missing = [] as string[];
  if (missingTitle) missing.push("title");
  if (missingDescription) missing.push("description");
  return missing.join(" + ");
};

const run = async () => {
  const files = await walk(PAGES_ROOT);
  const astroFiles = files.filter(
    (file) => file.endsWith(".astro") && !file.includes(`${path.sep}api${path.sep}`)
  );
  const missingEntries: Array<{ file: string; missing: string }> = [];
  const pagesWithoutBaseLayout: string[] = [];

  for (const file of astroFiles) {
    const content = await readFile(file, "utf-8");
    if (!content.includes("BaseLayout")) {
      pagesWithoutBaseLayout.push(file);
      continue;
    }

    const baseLayoutMatch = content.match(/<BaseLayout[\s\S]*?>/);
    if (!baseLayoutMatch) {
      pagesWithoutBaseLayout.push(file);
      continue;
    }

    const tag = baseLayoutMatch[0];
    const missingTitle = !/\btitle=/.test(tag);
    const missingDescription = !/\bdescription=/.test(tag);

    if (missingTitle || missingDescription) {
      missingEntries.push({
        file,
        missing: formatMissing(missingTitle, missingDescription),
      });
    }
  }

  const sortedMissing = missingEntries.sort((a, b) =>
    a.file.localeCompare(b.file)
  );
  const sortedWithoutLayout = pagesWithoutBaseLayout.sort();
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
  ];

  await writeFile(OUTPUT_PATH, lines.join("\n"));
  console.log(`Wrote ${path.relative(path.resolve("."), OUTPUT_PATH)}`);
};

await run();
