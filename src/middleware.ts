import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  const host = request.headers.get('host');
  const hostname = host?.split(':')[0].toLowerCase();

  if (hostname === 'ethotechnics.com') {
    const url = new URL(request.url);
    const redirectUrl = `https://ethotechnics.org${url.pathname}${url.search}`;

    return new Response(null, {
      status: 301,
      headers: {
        Location: redirectUrl,
      },
    });
  }

  return next();
};
