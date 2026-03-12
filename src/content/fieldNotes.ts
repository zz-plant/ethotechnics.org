import { fieldNotesContentData } from "./generated/field-notes.generated";
import type { PageWithPermalink, PublishedContent } from "./types";

export type FieldNoteEntry = PublishedContent & {
  slug: string;
  title: string;
  summary: string;
  format: "dispatch" | "case-study" | "signal";
  relatedTerms: string[];
  links?: string[];
};

export type FieldNotesContent = PageWithPermalink &
  PublishedContent & {
    sections: {
      title: string;
      description: string;
      format: FieldNoteEntry["format"];
    }[];
    entries: FieldNoteEntry[];
    latestUpdate: string;
    highlight: {
      title: string;
      summary: string;
      whyItMatters: string;
      href: string;
      ctaLabel: string;
    };
  };

export const fieldNotesContent: FieldNotesContent =
  fieldNotesContentData as FieldNotesContent;
