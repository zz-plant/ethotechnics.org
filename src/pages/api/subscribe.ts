import type { APIRoute } from "astro";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 4_096;
const ALLOWED_ORIGINS = new Set([
  "https://ethotechnics.org",
  "https://www.ethotechnics.org",
]);

type NewsletterEnv = {
  NEWSLETTER_WEBHOOK_URL?: string;
  NEWSLETTER_WEBHOOK_TOKEN?: string;
  NEWSLETTER_RATE_LIMITER?: {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  };
};

const json = (body: object, status: number) =>
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

export const POST: APIRoute = async ({ request, locals }) => {
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
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ error: "Request body is too large" }, 413);
  }

  const runtime = locals as unknown as { runtime?: { env?: NewsletterEnv } };
  const env = runtime.runtime?.env;
  if (env?.NEWSLETTER_RATE_LIMITER) {
    const key = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const rateLimit = await env.NEWSLETTER_RATE_LIMITER.limit({ key });
    if (!rateLimit.success) return json({ error: "Too many requests" }, 429);
  }

  let body: Record<string, unknown>;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ error: "Request body is too large" }, 413);
    }
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const rawEmail = typeof body.email === "string" ? body.email : "";
  const email = rawEmail.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ error: "Valid email required" }, 400);
  }

  if (!env?.NEWSLETTER_WEBHOOK_URL) {
    return json({ error: "Subscriptions are temporarily unavailable" }, 503);
  }

  let providerResponse: Response;
  try {
    providerResponse = await fetch(env.NEWSLETTER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(env.NEWSLETTER_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${env.NEWSLETTER_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ email, source: "ethotechnics.org" }),
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return json({ error: "Subscription service unavailable" }, 502);
  }

  if (!providerResponse.ok && providerResponse.status !== 409) {
    return json({ error: "Subscription service unavailable" }, 502);
  }

  return json({ success: true }, 200);
};
