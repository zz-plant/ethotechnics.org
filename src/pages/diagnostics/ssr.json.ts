import type { APIRoute } from 'astro';

const headersToReport = ['cf-connecting-ip', 'accept-language', 'user-agent'];

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const renderedAt = new Date().toISOString();
  const requestId = crypto.randomUUID();

  const payload = {
    renderedAt,
    requestId,
    method: request.method,
    path: `${url.pathname}${url.search}`,
    origin: request.headers.get('host') ?? 'Not provided',
    cacheControl: request.headers.get('cache-control') ?? 'Not provided',
    headers: headersToReport.map((key) => ({
      key,
      value: request.headers.get(key) ?? 'Not provided',
    })),
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
};
