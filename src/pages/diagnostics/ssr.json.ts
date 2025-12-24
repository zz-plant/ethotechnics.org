import type { APIRoute } from 'astro';
import { buildDiagnosticsSnapshot } from '../../lib/diagnostics/snapshot';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const payload = buildDiagnosticsSnapshot(request);

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
};
