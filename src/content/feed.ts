import { diagnosticsContent } from './diagnostics';
import { fieldNotesContent } from './fieldNotes';
import type { FieldNoteEntry } from './fieldNotes';
import { homeContent } from './home';
import { instituteContent } from './institute';
import { libraryContent } from './library';
import { researchContent } from './research';

export type ContentFeedItem = {
  title: string;
  description: string;
  path: string;
  pubDate: Date | string;
};

const pagePublicationDates = {
  homeHighlight: '2024-10-01T00:00:00Z',
  library: '2024-09-01T00:00:00Z',
  fieldNotes: '2024-09-01T00:00:00Z',
  research: '2024-09-01T00:00:00Z',
  diagnostics: '2024-09-01T00:00:00Z',
  institute: '2024-09-01T00:00:00Z',
} satisfies Record<string, string>;

const fieldNoteToFeedItem = (entry: FieldNoteEntry): ContentFeedItem => ({
  title: entry.title,
  description: entry.summary,
  path: `${fieldNotesContent.permalink}#${entry.slug}`,
  pubDate: entry.published,
});

export const loadRecentContent = (): ContentFeedItem[] => {
  const primaryPages: ContentFeedItem[] = [
    {
      title: homeContent.highlight.note.title,
      description: homeContent.highlight.note.description,
      path: '/#insights',
      pubDate: pagePublicationDates.homeHighlight,
    },
    {
      title: libraryContent.pageTitle,
      description: libraryContent.pageDescription,
      path: libraryContent.permalink,
      pubDate: pagePublicationDates.library,
    },
    {
      title: fieldNotesContent.pageTitle,
      description: fieldNotesContent.pageDescription,
      path: fieldNotesContent.permalink,
      pubDate: pagePublicationDates.fieldNotes,
    },
    {
      title: researchContent.pageTitle,
      description: researchContent.pageDescription,
      path: researchContent.permalink,
      pubDate: pagePublicationDates.research,
    },
    {
      title: diagnosticsContent.pageTitle,
      description: diagnosticsContent.pageDescription,
      path: diagnosticsContent.permalink,
      pubDate: pagePublicationDates.diagnostics,
    },
    {
      title: instituteContent.pageTitle,
      description: instituteContent.pageDescription,
      path: instituteContent.permalink,
      pubDate: pagePublicationDates.institute,
    },
  ];

  const fieldNoteItems = fieldNotesContent.entries.map(fieldNoteToFeedItem);

  return [...primaryPages, ...fieldNoteItems].sort(
    (first, second) => new Date(second.pubDate).getTime() - new Date(first.pubDate).getTime(),
  );
};
