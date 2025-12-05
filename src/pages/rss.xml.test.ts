import type { APIContext } from 'astro';
import { describe, expect, it } from 'vitest';

import { GET } from './rss.xml';

const extractItemLinks = async (response: Response) => {
  const xml = await response.text();
  return Array.from(xml.matchAll(/<item>[\s\S]*?<link>(.*?)<\/link>/g)).map(
    ([, link]) => link
  );
};

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
});
