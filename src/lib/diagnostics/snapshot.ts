const headersToReport = ['cf-connecting-ip', 'accept-language', 'user-agent'];

export type HeaderEntry = {
  key: string;
  value: string;
};

export type DiagnosticsSnapshot = {
  renderedAt: string;
  requestId: string;
  method: string;
  path: string;
  origin: string;
  cacheControl: string;
  headers: HeaderEntry[];
};

export const buildDiagnosticsSnapshot = (request: Request): DiagnosticsSnapshot => {
  const url = new URL(request.url);

  return {
    renderedAt: new Date().toISOString(),
    requestId: crypto.randomUUID(),
    method: request.method,
    path: `${url.pathname}${url.search}`,
    origin: request.headers.get('host') ?? 'Not provided',
    cacheControl: request.headers.get('cache-control') ?? 'Not provided',
    headers: headersToReport.map((key) => ({
      key,
      value: request.headers.get(key) ?? 'Not provided',
    })),
  };
};
