import type { GlossaryTerm } from "./glossary";
import { glossaryContent, glossaryTerms } from "./glossary";
import { libraryContentData } from "./generated/library.generated";
import type {
  PageWithPermalink,
  PublicationMetadata,
  PublishedContent,
} from "./types";

export type PatternFilter = {
  slug:
    | "capability"
    | "authority"
    | "evidence"
    | "dependency"
    | "standing"
    | "correction";
  label: string;
  description: string;
};

export type Pattern = {
  slug: string;
  title: string;
  summary: string;
  filters: PatternFilter["slug"][];
  glossaryRefs: string[];
  cues: string[];
  diagnostics: string[];
  steps: string[];
  policyRequirement: string;
  productRequirement: string;
  auditEvidenceChecklist: string;
  postmortemTrigger: string;
  artifacts: { name: string; purpose: string }[];
  example: { title: string; description: string };
  antiPatterns?: {
    title: string;
    failure: string;
    counterfactual: string;
    warning: string;
  }[];
};

export type LibraryContent = PageWithPermalink &
  PublishedContent & {
    publication: PublicationMetadata;
    glossary: { terms: GlossaryTerm[]; permalink: string };
    patterns: { filters: PatternFilter[]; entries: Pattern[] };
    quickStart: string[];
    recommended: {
      title: string;
      description: string;
      items: { title: string; description: string; href: string }[];
    };
  };

type LibraryContentWithoutGlossary = Omit<LibraryContent, "glossary">;

const baseLibraryContent = libraryContentData as LibraryContentWithoutGlossary;

export const libraryContent: LibraryContent = {
  ...baseLibraryContent,
  glossary: {
    terms: glossaryTerms,
    permalink: glossaryContent.permalink,
  },
};
