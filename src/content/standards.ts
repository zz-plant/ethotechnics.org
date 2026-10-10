import data from "../data/standards.json" with { type: "json" };
import type { AnchorLink, PageWithPermalink } from "./types";
import { z } from "zod";

export type StandardEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: "Draft" | "Stable" | "Deprecated";
  // Standards without a published page stay in the registry so clauses and
  // changelogs keep resolving, but must not surface in the catalog or sitemap.
  listedOnSite?: boolean;
  version: string;
  changelogHref?: string;
  changelogEntries?: {
    version: string;
    date: string;
    summary: string;
    href?: string;
  }[];
  stableCriteria: string;
  deprecatedBy?: {
    id: string;
    slug: string;
    title: string;
  }[];
  effectiveDate: string;
  published: string;
};

export type DoctrineEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
  ctaLabel: string;
};

export type StandardsContent = PageWithPermalink & {
  anchorLinks: AnchorLink[];
  standards: StandardEntry[];
  doctrine: DoctrineEntry[];
};

export type ClauseRequirementLevel = "MUST" | "SHOULD";
export type ClauseType = "right" | "obligation";

export type StandardClause = {
  id: string;
  standardId: string;
  displayId: string;
  type: ClauseType;
  requirementLevel: ClauseRequirementLevel;
  condition: string;
  obligation: string;
  evidenceRequired: string[];
  timeBound: string;
  failureModes?: string[];
  relatedMechanisms: string[];
  relatedValidators: string[];
};

const changelogEntrySchema = z.object({
  version: z.string(),
  date: z.string(),
  summary: z.string(),
  href: z.string().optional(),
});

const standardEntrySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["Draft", "Stable", "Deprecated"]),
  listedOnSite: z.boolean().optional(),
  version: z.string(),
  changelogHref: z.string().optional(),
  changelogEntries: z.array(changelogEntrySchema).optional(),
  stableCriteria: z.string(),
  deprecatedBy: z
    .array(
      z.object({
        id: z.string(),
        slug: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
  effectiveDate: z.string(),
  published: z.string(),
});

const doctrineEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  href: z.string(),
  eyebrow: z.string().optional(),
  ctaLabel: z.string(),
});

const standardsContentSchema = z.object({
  pageTitle: z.string(),
  pageDescription: z.string(),
  permalink: z.string(),
  anchorLinks: z.array(z.object({ href: z.string(), label: z.string() })),
  standards: z.array(standardEntrySchema),
  doctrine: z.array(doctrineEntrySchema),
});

const standardClauseSchema = z.object({
  id: z.string(),
  standardId: z.string(),
  displayId: z.string(),
  type: z.enum(["right", "obligation"]),
  requirementLevel: z.enum(["MUST", "SHOULD"]),
  condition: z.string(),
  obligation: z.string(),
  evidenceRequired: z.array(z.string()),
  timeBound: z.string(),
  failureModes: z.array(z.string()).optional(),
  relatedMechanisms: z.array(z.string()),
  relatedValidators: z.array(z.string()),
});

const dataSchema = z.object({
  standardsContent: standardsContentSchema,
  standardClauses: z.record(z.string(), z.array(standardClauseSchema)),
});

// Entry notes carried from the hand-written literal:
// - MVC-01 was marked Stable at publication, but none of its stable criteria
//   was ever recorded as met, which the status model requires. Draft until
//   they are. PM-01 has the same correction: stable on release, with no record
//   of the three retrospectives its criteria ask for.
// - STD-04, a withdrawn profile, has no date it comes into effect; its
//   effectiveDate is the date it stopped being the recommendation.
const parsed = dataSchema.parse(data);

export const standardsContent: StandardsContent = parsed.standardsContent;

export const standardClauses: Record<string, StandardClause[]> =
  parsed.standardClauses;

/**
 * Resolve a standard id such as "STD-08" to its entry, so callers can link by
 * slug. Lower-casing an id does not produce a slug: STD-08 lives at
 * /standards/std-08-delegation, and pages that guessed the slug from the id
 * emitted 404s for every standard they cited.
 */
export const getStandardById = (id: string): StandardEntry | undefined =>
  standardsContent.standards.find((standard) => standard.id === id);

export const getStandardBySlug = (slug: string): StandardEntry | undefined =>
  standardsContent.standards.find((standard) => standard.slug === slug);
