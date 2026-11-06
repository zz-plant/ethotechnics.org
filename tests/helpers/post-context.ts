import type { APIContext } from "astro";

/** An APIContext for a same-origin JSON POST to an /api route. */
export const createPostContext = (
  path: string,
  body: string,
  env: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) => {
  const request = new Request(`https://ethotechnics.org${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://ethotechnics.org",
      ...headers,
    },
    body,
  });
  // Bun's Request drops forbidden headers such as Origin; answer them here.
  const originalGet = request.headers.get.bind(request.headers);
  request.headers.get = (name: string) => {
    const override = Object.entries(headers).find(
      ([key]) => key.toLowerCase() === name.toLowerCase(),
    )?.[1];
    if (override !== undefined) return override;
    if (name.toLowerCase() === "origin") return "https://ethotechnics.org";
    if (name.toLowerCase() === "content-type") return "application/json";
    return originalGet(name);
  };

  return {
    request,
    locals: { runtime: { env } },
  } as unknown as APIContext;
};
