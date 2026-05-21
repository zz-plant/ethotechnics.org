import type { MiddlewareHandler } from 'astro';

const applySecurityHeaders = (response: Response): Response => {
  const securityHeaders: Record<string, string> = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=()',
  };

  try {
    for (const [name, value] of Object.entries(securityHeaders)) {
      response.headers.set(name, value);
    }

    return response;
  } catch {
    return response;
  }
};

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  const hostname = new URL(request.url).host.split(':')[0]?.trim().toLowerCase();

  if (hostname && (hostname === 'ethotechnics.com' || hostname.endsWith('.ethotechnics.com'))) {
    const url = new URL(request.url);
    return applySecurityHeaders(
      new Response(null, {
        status: 301,
        headers: { Location: `https://ethotechnics.org${url.pathname}${url.search}` },
      }),
    );
  }

  const response = await next();
  return response ? applySecurityHeaders(response) : response;
};
