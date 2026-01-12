import type { MiddlewareHandler } from 'astro';

const generateNonce = () => crypto.randomUUID().replaceAll('-', '');

const createSecurityHeaders = (nonce: string): Record<string, string> => ({
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy':
    [
      "default-src 'self'",
      "base-uri 'self'",
      "connect-src 'self'",
      "font-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: https:",
      "object-src 'none'",
      `script-src 'self' 'nonce-${nonce}'`,
      "style-src 'self' 'unsafe-inline'",
    ].join('; '),
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=()',
});

const applySecurityHeaders = (response: Response, nonce: string) => {
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(createSecurityHeaders(nonce))) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const onRequest: MiddlewareHandler = async ({ request, locals }, next) => {
  const nonce = generateNonce();

  if (locals) {
    locals.cspNonce = nonce;
  }

  const host = request.headers.get('host');

  if (!host) {
    const response = await next();
    return response ? applySecurityHeaders(response, nonce) : response;
  }

  const hostname = host.split(':')[0]?.trim().toLowerCase();

  if (!hostname) {
    const response = await next();
    return response ? applySecurityHeaders(response, nonce) : response;
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
      nonce,
    );
  }

  const response = await next();
  return response ? applySecurityHeaders(response, nonce) : response;
};
