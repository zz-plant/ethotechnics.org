/**
 * Shared HTTP helpers for the check-* scripts.
 *
 * check-sitemap and check-reachability both probe a running site one URL at a
 * time with retries and a bounded worker pool. The pool and the retrying
 * status probe live here once instead of in every script.
 */

export type FetchStatusOptions = {
  /** How many times to retry before reporting no answer. Default 3. */
  retries?: number;
  /** Milliseconds between retries. Default 500. */
  retryDelayMs?: number;
  /** "manual" to see redirects as non-200 statuses. Default "manual". */
  redirect?: RequestRedirect;
};

/**
 * The status one URL answered, or -1 when the server never answered after
 * retries. Reads the whole body so keep-alive connections get returned to the
 * pool before the next request.
 */
export async function fetchStatus(
  url: string,
  {
    retries = 3,
    retryDelayMs = 500,
    redirect = "manual",
  }: FetchStatusOptions = {},
): Promise<number> {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url, { redirect });
      await response.arrayBuffer();
      return response.status;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
  return -1;
}

/**
 * Map a worker over items with a fixed number of concurrent calls, preserving
 * input order in the result. The check scripts cap concurrency so a probe run
 * against a local preview server does not open hundreds of sockets at once.
 */
export async function pool<T, R>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await worker(items[index]!);
      }
    }),
  );
  return results;
}
