/**
 * The Worker's bindings, from wherever this code is running.
 *
 * Under @astrojs/cloudflare 14 the bindings come from `cloudflare:workers`;
 * `Astro.locals.runtime.env` throws. Under `bun test` that module does not
 * exist, and a test supplies bindings on `locals.runtime.env` instead. Try
 * the runtime first, then the test seam, and treat both failures as "no
 * bindings", which every caller already handles by failing closed.
 */
export async function resolveEnv<T extends object>(
  locals: unknown,
): Promise<T | undefined> {
  try {
    const runtime = (await import("cloudflare:workers")) as unknown as {
      env?: T;
    };
    if (runtime.env) return runtime.env;
  } catch {
    // Not running in a Worker.
  }
  try {
    return (locals as { runtime?: { env?: T } }).runtime?.env;
  } catch {
    return undefined;
  }
}
