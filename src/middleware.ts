import type { MiddlewareHandler } from "astro";

const COM_HOST_RE = /^(www\.)?ethotechnics\.com$/i;

const applySecurityHeaders = (response: Response): Response => {
  const securityHeaders: Record<string, string> = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Permissions-Policy":
      "camera=(), geolocation=(), microphone=(), payment=()",
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

export const onRequest: MiddlewareHandler = async (context, next) => {
  const host = context.request.headers.get("host") ?? "";

  if (host && COM_HOST_RE.test(host)) {
    const url = new URL(context.request.url);
    url.hostname = "ethotechnics.org";
    url.host = "ethotechnics.org";

    const redirect = new Response(null, {
      status: 301,
      headers: { Location: url.toString() },
    });

    return applySecurityHeaders(redirect);
  }

  const response = await next();
  return response ? applySecurityHeaders(response) : response;
};
