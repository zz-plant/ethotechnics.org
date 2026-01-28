import type { GlossaryEntry } from "../content/glossary";

import { glossaryPermalink } from "./glossary";

export type GlossarySectionDefinition = {
  id: string;
  label: string;
  description: string;
};

export const glossarySections: GlossarySectionDefinition[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Definition and summary context for the glossary entry.",
  },
  {
    id: "scope",
    label: "Scope",
    description: "When and where the term applies in practice.",
  },
  {
    id: "operational-tests",
    label: "Operational tests",
    description: "The checks teams can run to verify the term in the field.",
  },
  {
    id: "minimum-evidence",
    label: "Minimum evidence",
    description: "Artifacts, behaviors, and metrics required for proof.",
  },
  {
    id: "evidence-artifact",
    label: "Evidence artifact",
    description: "The concrete artifact needed to validate the term.",
  },
  {
    id: "evidence-behavior",
    label: "Evidence behavior",
    description: "Observed behavior that confirms the term in action.",
  },
  {
    id: "evidence-metric",
    label: "Evidence metric",
    description: "Metrics, calculations, and thresholds tied to the term.",
  },
  {
    id: "genealogy",
    label: "Genealogy",
    description: "The lineage and conceptual roots of the term.",
  },
  {
    id: "status",
    label: "Status",
    description: "Revision metadata, updates, and changelog notes.",
  },
  {
    id: "classification",
    label: "Classification",
    description: "Domains, scale, and maturity metadata for the term.",
  },
  {
    id: "tags",
    label: "Tags",
    description: "Thematic tags and cross-cutting labels.",
  },
  {
    id: "references",
    label: "References",
    description: "Source material and citations linked to the term.",
  },
  {
    id: "resources",
    label: "Resources",
    description: "Supplementary tools or downloads for the term.",
  },
  {
    id: "examples",
    label: "Examples",
    description: "Illustrative scenarios showing the term in context.",
  },
  {
    id: "related-patterns",
    label: "Related patterns",
    description: "Mechanisms and patterns connected to this term.",
  },
];

const normalizedGlossaryRoot = glossaryPermalink.replace(/\/+$/, "");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const glossarySectionPermalink = (slug: string, sectionId: string) =>
  `${normalizedGlossaryRoot}/entries/${slug}/${sectionId}`;

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

export const getGlossarySectionById = (sectionId: string) =>
  glossarySections.find((section) => section.id === sectionId) ?? null;

export const buildGlossarySectionLinks = (entry: GlossaryEntry) =>
  glossarySections.map((section) => ({
    label: section.label,
    href: glossarySectionPermalink(entry.id, section.id),
  }));
