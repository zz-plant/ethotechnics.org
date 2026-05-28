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
  const response = await next();
  return response ? applySecurityHeaders(response) : response;
};
