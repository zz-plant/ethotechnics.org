import { getEntry } from 'astro:content';

import { diagnosticsContent } from './diagnostics';
import { fieldNotesContent } from './fieldNotes';
import type { FieldNoteEntry } from './fieldNotes';
import { instituteContent } from './institute';
import { libraryContent } from './library';
import { researchContent } from './research';

export type ContentFeedItem = {
  title: string;
  description: string;
  path: string;
  pubDate: Date | string;
};

const defaultPublicationDate = '1970-01-01T00:00:00Z';

type DatedContent = {
  published?: string;
  updated?: string;
};

const latestPublicationDate = ({ published, updated }: DatedContent) =>
  updated ?? published ?? defaultPublicationDate;

const fieldNoteToFeedItem = (entry: FieldNoteEntry): ContentFeedItem => ({
  title: entry.title,
  description: entry.summary,
  path: `${fieldNotesContent.permalink}#${entry.slug}`,
  pubDate: latestPublicationDate(entry),
});

export const loadRecentContent = async (): Promise<ContentFeedItem[]> => {
  const homeEntry = await getEntry('home', 'home');
  const highlightNote = homeEntry?.data.highlight?.note;

  if (!highlightNote) {
    console.warn('Home content is missing highlight note data for the feed.');
  }

  const primaryPages: ContentFeedItem[] = [
    ...(highlightNote
      ? [
          {
            title: highlightNote.title,
            description: highlightNote.description,
            path: '/#insights',
            pubDate: latestPublicationDate(highlightNote),
          },
        ]
      : []),
    {
      title: libraryContent.pageTitle,
      description: libraryContent.pageDescription,
      path: libraryContent.permalink,
      pubDate: latestPublicationDate(libraryContent),
    },
    {
      title: fieldNotesContent.pageTitle,
      description: fieldNotesContent.pageDescription,
      path: fieldNotesContent.permalink,
      pubDate: latestPublicationDate(fieldNotesContent),
    },
    {
      title: researchContent.pageTitle,
      description: researchContent.pageDescription,
      path: researchContent.permalink,
      pubDate: latestPublicationDate(researchContent),
    },
    {
      title: diagnosticsContent.pageTitle,
      description: diagnosticsContent.pageDescription,
      path: diagnosticsContent.permalink,
      pubDate: latestPublicationDate(diagnosticsContent),
    },
    {
      title: instituteContent.pageTitle,
      description: instituteContent.pageDescription,
      path: instituteContent.permalink,
      pubDate: latestPublicationDate(instituteContent),
    },
  ];

  const fieldNoteItems = fieldNotesContent.entries.map(fieldNoteToFeedItem);

  return [...primaryPages, ...fieldNoteItems].sort(
    (first, second) => new Date(second.pubDate).getTime() - new Date(first.pubDate).getTime(),
  );
};
