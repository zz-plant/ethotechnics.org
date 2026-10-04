import type { APIRoute } from "astro";
import { resolveEnv } from "../../utils/cloudflare-env";
import {
  MAX_READOUT_BYTES,
  readoutPath,
  readoutRequestSchema,
  saveReadout,
  type ReadoutEnv,
} from "../../utils/readouts";

/**
 * POST /api/readouts — store a diagnostic's inputs and return the permalink.
 *
 * Same-origin only, JSON only, small bodies only, and rate limited where the
 * binding exists. The body is validated against the tool's input schema, so
 * KV never holds anything the readout page cannot rerun.
 */

const ALLOWED_ORIGINS = new Set([
  "https://ethotechnics.org",
  "https://www.ethotechnics.org",
]);

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
  if (Number.isFinite(declaredLength) && declaredLength > MAX_READOUT_BYTES) {
    return json({ error: "Request body is too large" }, 413);
  }

  const env = await resolveEnv<ReadoutEnv>(locals);
  if (!env?.READOUTS) {
    return json({ error: "Readouts are not enabled in this environment" }, 503);
  }
  if (env.READOUT_RATE_LIMITER) {
    const key = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const rateLimit = await env.READOUT_RATE_LIMITER.limit({ key });
    if (!rateLimit.success) return json({ error: "Too many requests" }, 429);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_READOUT_BYTES) {
      return json({ error: "Request body is too large" }, 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: "Request body must be valid JSON" }, 400);
  }

  const parsed = readoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        error: "Readout does not match the tool's input schema",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      422,
    );
  }

  const { id, record } = await saveReadout(env.READOUTS, parsed.data);
  const url = new URL(readoutPath(id), request.url).toString();
  return json({ id, url, captured_at: record.captured_at }, 201);
};
