import type { MiddlewareHandler } from 'astro';

const securityHeaders: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline';",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=()',
};

const applySecurityHeaders = (response: Response) => {
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  const host = request.headers.get('host');

  if (!host) {
    const response = await next();
    return response ? applySecurityHeaders(response) : response;
  }

  const hostname = host.split(':')[0]?.trim().toLowerCase();

  if (!hostname) {
    const response = await next();
    return response ? applySecurityHeaders(response) : response;
  }

  if (hostname === 'ethotechnics.com' || hostname.endsWith('.ethotechnics.com')) {
    const url = new URL(request.url);
    const redirectUrl = `https://ethotechnics.org${url.pathname}${url.search}`;

    return applySecurityHeaders(
      new Response(null, {
        status: 301,
        headers: {
          Location: redirectUrl,
        },
      }),
    );
  }

  const response = await next();
  return response ? applySecurityHeaders(response) : response;
};
