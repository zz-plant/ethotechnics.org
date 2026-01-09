import type { APIContext } from 'astro';
import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

import { GET } from '../pages/rss.xml';

// Mock the feed module
const mockLoadRecentContent = mock(() => [] as any[]);
mock.module('../content/feed', () => ({
  loadRecentContent: mockLoadRecentContent,
}));

const extractItemLinks = async (response: Response) => {
  const xml = await response.text();
  return Array.from(xml.matchAll(/<item>[\s\S]*?<link>(.*?)<\/link>/g)).map(
    ([, link]) => link
  );
};

const baseFeedItems = [
  {
    title: 'Refreshing consent after policy shifts',
    description: 'Dispatches about renewing consent with clear exits and summaries.',
    path: '/field-notes#consent-refresh',
    pubDate: '2024-10-08T00:00:00Z',
  },
  {
    title: 'Library — Reusable guidance for teams',
    description: 'Reference shelf for ethical technology frameworks, reading lists, and implementation patterns.',
    path: '/library',
    pubDate: '2024-09-01T00:00:00Z',
  },
];

beforeEach(() => {
  mockLoadRecentContent.mockReturnValue(baseFeedItems);
});

describe('rss feed item links', () => {
  it('uses fallback host when site is missing', async () => {
    const response = GET({
      request: new Request('https://example.test/rss.xml'),
      site: undefined,
    } as APIContext);

    const itemLinks = await extractItemLinks(response);

    expect(itemLinks.length).toBeGreaterThan(0);
    for (const link of itemLinks) {
      expect(link).toMatch(/^https:\/\/ethotechnics\.org/);
      expect(() => new URL(link)).not.toThrow();
    }
  });

  it('uses provided site when present', async () => {
    const response = GET({
      request: new Request('https://example.test/rss.xml'),
      site: new URL('https://example.org'),
    } as APIContext);

    const itemLinks = await extractItemLinks(response);

    expect(itemLinks.length).toBeGreaterThan(0);
    for (const link of itemLinks) {
      expect(link).toMatch(/^https:\/\/example\.org/);
      expect(() => new URL(link)).not.toThrow();
    }
  });

  it('skips items that are missing required fields', async () => {
    const warnSpy = spyOn(console, 'warn').mockImplementation(() => {});

    mockLoadRecentContent.mockReturnValue([
      ...baseFeedItems,
      { title: 'Untitled', description: '', path: '/missing', pubDate: 'invalid-date' },
    ]);

    const response = GET({
      request: new Request('https://example.test/rss.xml'),
      site: undefined,
    } as APIContext);

    const itemLinks = await extractItemLinks(response);

    expect(itemLinks).toHaveLength(baseFeedItems.length);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
