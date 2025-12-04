import { describe, expect, it, vi } from 'vitest';

import { onRequest } from './middleware';

describe('middleware', () => {
  it('redirects ethotechnics.com to ethotechnics.org', async () => {
    const request = new Request('https://ethotechnics.com/path?foo=bar', {
      headers: { host: 'ethotechnics.com' },
    });
    const next = vi.fn(async () => new Response('next'));

    const response = await onRequest({ request } as any, next);

    if (!response) {
      throw new Error('Expected redirect response');
    }

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe(
      'https://ethotechnics.org/path?foo=bar'
    );
    expect(next).not.toHaveBeenCalled();
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
