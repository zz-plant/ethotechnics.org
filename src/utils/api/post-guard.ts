const ALLOWED_ORIGINS = new Set([
  "https://ethotechnics.org",
  "https://www.ethotechnics.org",
]);

export const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const isAllowedOrigin = (request: Request) => {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  return origin === new URL(request.url).origin || ALLOWED_ORIGINS.has(origin);
};

/**
 * The checks a form-facing POST runs before it reads the body: same origin,
 * JSON, and a declared size within the limit. Returns the refusal, or null.
 */
export const rejectPost = (request: Request, maxBytes: number) => {
  if (!isAllowedOrigin(request))
    return json({ error: "Request origin is not allowed" }, 403);
  if (
    !request.headers
      .get("Content-Type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return json({ error: "Content-Type must be application/json" }, 415);
  }

  const declaredLength = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return json({ error: "Request body is too large" }, 413);
  }
  return null;
};
