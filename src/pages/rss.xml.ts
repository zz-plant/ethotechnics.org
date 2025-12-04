import type { APIContext } from 'astro';
import { homeContent } from '../content/home';

type FeedItem = {
  title: string;
  description: string;
  path: string;
  pubDate: Date | string;
};

const fallbackSite = 'https://ethotechnics.org';

const feedItems: FeedItem[] = [
  {
    title: 'Design for consent, not just conversion',
    description:
      'Pair clear primary actions with transparent context—why you are asking, what happens next, and how to opt out.',
    path: '/#insights',
    pubDate: '2024-10-01T00:00:00Z',
  },
  {
    title: 'Field Notes — Signals from real deployments',
    description: 'Dispatches, reflections, and prompts from ongoing practice in ethical technology.',
    path: '/field-notes',
    pubDate: '2024-09-01T00:00:00Z',
  },
  {
    title: 'Library — Reusable guidance for teams',
    description: 'Reference shelf for ethical technology frameworks, reading lists, and implementation patterns.',
    path: '/library',
    pubDate: '2024-09-01T00:00:00Z',
  },
  {
    title: 'Research — Methods grounded in lived experience',
    description: 'Inquiries, methods, and study findings that surface the human impacts of technology.',
    path: '/research',
    pubDate: '2024-09-01T00:00:00Z',
  },
  {
    title: 'Diagnostics — Assessment kits and scorecards',
    description: 'Tools for auditing systems, measuring risk, and tracking progress on responsible technology goals.',
    path: '/diagnostics',
    pubDate: '2024-09-01T00:00:00Z',
  },
  {
    title: 'Institute — Gatherings and collaboration',
    description: 'Programs, convenings, and ways to collaborate on the Ethotechnics institute roadmap.',
    path: '/institute',
    pubDate: '2024-09-01T00:00:00Z',
  },
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export function GET({ site, request }: APIContext) {
  const siteUrl = site ?? new URL(fallbackSite);
  const baseUrl = site ?? new URL(request.url);

  const items = feedItems
    .map((item) => {
      const itemUrl = new URL(item.path, baseUrl);
      const publishedDate =
        typeof item.pubDate === 'string' ? new Date(item.pubDate) : item.pubDate;
      const published = publishedDate.toUTCString();

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
    <title>${escapeXml(homeContent.pageTitle)}</title>
    <link>${siteUrl.toString()}</link>
    <description>${escapeXml(homeContent.pageDescription)}</description>
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
