import { join } from "node:path";
import { z } from "zod";

type GlossaryEntry = {
  id: string;
  title: string;
  adjacentTerms?: string[];
  presenceChecks?: string[];
  missingExpectations?: string[];
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

const glossarySchema = z
  .array(
    z.object({
      categories: z.array(
        z.object({
          id: z.string(),
          heading: z.string(),
          entries: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              adjacentTerms: z.array(z.string()).optional(),
              presenceChecks: z.array(z.string()).optional(),
              missingExpectations: z.array(z.string()).optional(),
              relatedPatterns: z.array(z.string()).optional(),
              references: z
                .array(
                  z.object({
                    label: z.string(),
                    href: z.string(),
                    type: z.string(),
                  }),
                )
                .optional(),
              resources: z
                .array(
                  z.object({
                    label: z.string(),
                    href: z.string(),
                    type: z.string(),
                  }),
                )
                .optional(),
            }),
          ),
        }),
      ),
    }),
  )
  .min(1, { message: "Glossary content must include at least one entry." });

const librarySchema = z
  .array(
    z.object({
      patterns: z.object({
        entries: z.array(
          z.object({
            slug: z.string(),
          }),
        ),
      }),
    }),
  )
  .min(1, { message: "Library content must include at least one entry." });

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

const glossaryResult = glossarySchema.safeParse(glossaryData);
if (!glossaryResult.success) {
  console.error("❌ Glossary content failed schema validation.");
  console.error(JSON.stringify(glossaryResult.error.issues, null, 2));
  process.exit(1);
}

const libraryResult = librarySchema.safeParse(libraryData);
if (!libraryResult.success) {
  console.error("❌ Library content failed schema validation.");
  console.error(JSON.stringify(libraryResult.error.issues, null, 2));
  process.exit(1);
}

const glossary = glossaryResult.data[0];
const library = libraryResult.data[0];

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

    if (entry.presenceChecks) {
      entry.presenceChecks.forEach((term) => {
        if (!glossaryIds.has(term)) {
          errors.push(
            `Presence check "${term}" referenced by "${entry.id}" does not exist.`,
          );
        }
      });
    }

    if (entry.missingExpectations) {
      entry.missingExpectations.forEach((term) => {
        if (!glossaryIds.has(term)) {
          errors.push(
            `Missing expectation "${term}" referenced by "${entry.id}" does not exist.`,
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
