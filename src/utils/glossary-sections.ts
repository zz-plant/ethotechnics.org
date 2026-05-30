import { glossaryPermalink } from "./glossary";

const normalizedGlossaryRoot = glossaryPermalink.replace(/\/+$/, "");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const glossaryTestPermalink = (slug: string, testSlug: string) =>
  `${normalizedGlossaryRoot}/entries/${slug}/tests/${testSlug}`;

export const getGlossaryTestSlugs = (tests: string[]) => {
  const slugCounts = new Map<string, number>();

  return tests.map((test) => {
    const baseSlug = slugify(test) || "test";
    const count = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;

    return { slug, label: test };
  });
};
