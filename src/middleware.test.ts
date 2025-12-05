import { describe, expect, it, vi } from 'vitest';

import { onRequest } from './middleware';

describe('middleware', () => {
  it('redirects ethotechnics.com variants to ethotechnics.org', async () => {
    const redirectCases = [
      {
        url: 'https://ethotechnics.com/path?foo=bar',
        host: 'ethotechnics.com',
        expectedLocation: 'https://ethotechnics.org/path?foo=bar',
      },
      {
        url: 'https://www.ethotechnics.com/with-www?foo=bar',
        host: 'www.ethotechnics.com',
        expectedLocation: 'https://ethotechnics.org/with-www?foo=bar',
      },
      {
        url: 'https://www.ethotechnics.com/mixed?foo=bar',
        host: 'WWw.EthoTechnics.Com',
        expectedLocation: 'https://ethotechnics.org/mixed?foo=bar',
      },
    ];

    for (const { url, host, expectedLocation } of redirectCases) {
      const request = new Request(url, { headers: { host } });
      const next = vi.fn(async () => new Response('next'));

      const response = await onRequest({ request } as any, next);

      if (!response) {
        throw new Error('Expected redirect response');
      }

      expect(response.status).toBe(301);
      expect(response.headers.get('Location')).toBe(expectedLocation);
      expect(next).not.toHaveBeenCalled();
    }
  });

  it('skips redirects when host header is missing or empty', async () => {
    const cases: Array<HeadersInit | undefined> = [undefined, { host: '' }];

    for (const headers of cases) {
      const request = new Request('https://example.com/path', { headers });
      const next = vi.fn(async () => new Response('next'));

      const response = await onRequest({ request } as any, next);

      if (!response) {
        throw new Error('Expected next response');
      }

      expect(response.status).toBe(200);
      expect(await response.text()).toBe('next');
      expect(next).toHaveBeenCalledTimes(1);
    }
  });
});
