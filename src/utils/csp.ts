import { createHash } from "node:crypto";

/**
 * CSP hash for the body of an inline `<script>` or `<style>` element.
 *
 * `security.csp` only hashes the scripts and styles Astro itself generates, so
 * anything rendered with `is:inline` is blocked unless its hash is registered
 * through `Astro.csp`. The hash must cover the exact text that ends up inside
 * the element, so callers pass the same string to `set:html`.
 */
export const cspHash = (source: string): `sha256-${string}` =>
  `sha256-${createHash("sha256").update(source, "utf8").digest("base64")}`;
