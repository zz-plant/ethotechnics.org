import type { APIContext } from 'astro';

const redirectPath = '/favicon.svg';

export function GET({ request }: APIContext) {
  const url = new URL(request.url);
  url.pathname = redirectPath;
  url.search = '';

  return new Response(null, {
    status: 301,
    headers: {
      Location: url.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
