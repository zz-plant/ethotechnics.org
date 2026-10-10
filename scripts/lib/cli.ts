/**
 * Shared helpers for the check-* scripts: argument parsing and failure exit.
 *
 * The check scripts all answer the same shape of question — read the tree or
 * a running site, decide pass or fail, name what failed — so they share the
 * same small CLI conventions instead of each re-implementing them.
 */

/** Print a failure and exit non-zero. Every check script ends with this. */
export function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

/** Catch an unexpected top-level error and exit non-zero. */
export function crash(error: unknown): never {
  console.error(error);
  process.exit(1);
}

/**
 * The base URL every "run against a built site" check takes as its first
 * argument, defaulting to the local preview server.
 */
export function baseUrlArg(defaultUrl = "http://127.0.0.1:4321"): string {
  return process.argv[2] ?? defaultUrl;
}
