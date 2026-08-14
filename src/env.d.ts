/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

declare module "*.astro" {
  const Component: import("astro/runtime/server").AstroComponentFactory;
  export default Component;
}

// Cloudflare runtime type for Astro.locals.runtime
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface Env {
  NEWSLETTER_WEBHOOK_URL?: string;
  NEWSLETTER_WEBHOOK_TOKEN?: string;
  NEWSLETTER_RATE_LIMITER?: {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  };
}

declare module "/pagefind/pagefind.js" {
  export function options(options: { excerptLength: number }): Promise<void>;
  export function search(query: string): Promise<{
    results: {
      data: () => Promise<{
        url: string;
        excerpt: string;
        meta: { title: string };
      }>;
    }[];
  }>;
}

declare module "*.wasm?url" {
  const url: string;
  export default url;
}
