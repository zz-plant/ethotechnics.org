import { join } from "node:path";

type GlossaryEntry = {
  id: string;
  title: string;
  adjacentTerms?: string[];
  relatedPatterns?: string[];
  references?: { label: string; href: string; type: string }[];
  resources?: { label: string; href: string; type: string }[];
};

type GlossaryCategory = {
  id: string;
  heading: string;
  entries: GlossaryEntry[];
};

type GlossaryContent = {
  categories: GlossaryCategory[];
};

type LibraryContent = {
  patterns: { entries: { slug: string }[] };
};

const readJson = async <T>(relativePath: string): Promise<T> => {
  const filePath = join(process.cwd(), relativePath);
  const content = await Bun.file(filePath).text();
  return JSON.parse(content) as T;
};

const isValidHref = (href: string): boolean => {
  if (!href.trim()) {
    return false;
  }

  if (
    href.startsWith("#") ||
    href.startsWith("/") ||
    href.startsWith("mailto:")
  ) {
    return true;
  }

  try {
    new URL(href);
    return true;
  } catch {
    return false;
  }
};

const glossaryData = await readJson<GlossaryContent[]>(
  "src/content/glossary.json",
);
const libraryData = await readJson<LibraryContent[]>(
  "src/content/library.json",
);

const glossary = glossaryData[0];
const library = libraryData[0];

if (!glossary || !library) {
  console.error("❌ Glossary or library content is missing.");
  process.exit(1);
}

const errors: string[] = [];
const glossaryIds = new Set<string>();
const patternSlugs = new Set<string>(
  library.patterns.entries.map((entry) => entry.slug),
);

for (const category of glossary.categories) {
  for (const entry of category.entries) {
    if (glossaryIds.has(entry.id)) {
      errors.push(
        `Duplicate glossary entry id "${entry.id}" in ${category.heading}.`,
      );
    }

    glossaryIds.add(entry.id);
  }
}

for (const category of glossary.categories) {
  for (const entry of category.entries) {
    if (entry.adjacentTerms) {
      entry.adjacentTerms.forEach((term) => {
        if (!glossaryIds.has(term)) {
          errors.push(
            `Adjacent term "${term}" referenced by "${entry.id}" does not exist.`,
          );
        }
      });
    }

    if (entry.relatedPatterns) {
      entry.relatedPatterns.forEach((slug) => {
        if (!patternSlugs.has(slug)) {
          errors.push(
            `Related pattern "${slug}" referenced by "${entry.id}" does not exist.`,
          );
        }
      });
    }

    const resources = [
      ...(entry.references ?? []),
      ...(entry.resources ?? []),
    ];

    resources.forEach((resource) => {
      if (!isValidHref(resource.href)) {
        errors.push(
          `Invalid resource href "${resource.href}" in "${entry.id}".`,
        );
      }
    });
  }
}

if (errors.length > 0) {
  console.error("❌ Glossary validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("✅ Glossary validation passed.");
