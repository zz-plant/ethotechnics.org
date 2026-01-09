/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*.astro" {
  const Component: import("astro/runtime/server").AstroComponentFactory;
  export default Component;
}

declare namespace App {
  interface Locals {
    cspNonce: string;
  }
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
