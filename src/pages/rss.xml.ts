import type { APIContext } from 'astro';
import { getEntry } from 'astro:content';

import type { ContentFeedItem } from '../content/feed';
import { loadRecentContent } from '../content/feed';

type ValidatedFeedItem = ContentFeedItem & { pubDate: Date };

const fallbackSite = 'https://ethotechnics.org';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const homeEntry = await getEntry('home', 'home');

  if (!homeEntry) {
    throw new Error('Home content entry is missing.');
  }

  const feedItems = await loadRecentContent();
  const itemsWithValidDates: ValidatedFeedItem[] = feedItems.flatMap((item) => {
    if (!item.title || !item.description || !item.path || !item.pubDate) {
      console.warn('Skipping feed item missing required fields', item);
      return [];
    }

    const publishedDate =
      typeof item.pubDate === 'string' ? new Date(item.pubDate) : item.pubDate;

    if (Number.isNaN(publishedDate.getTime())) {
      console.warn('Skipping feed item with invalid date', item);
      return [];
    }

    return [{ ...item, pubDate: publishedDate }];
  });

  const items = itemsWithValidDates
    .map((item) => {
      const itemUrl = new URL(item.path, siteUrl);
      const published = item.pubDate.toUTCString();

      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${itemUrl.toString()}</link>
  <guid>${itemUrl.toString()}</guid>
  <description><![CDATA[${item.description}]]></description>
  <pubDate>${published}</pubDate>
</item>`;
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(homeEntry.data.pageTitle)}</title>
    <link>${siteUrl.toString()}</link>
    <description>${escapeXml(homeEntry.data.pageDescription)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
