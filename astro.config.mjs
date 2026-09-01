import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import react from "@astrojs/react";
import robotsTxt from "astro-robots-txt";

export default defineConfig({
  site: "https://ethotechnics.org",
  prefetch: true,
  compressHTML: false,
  output: "server",
  server: {
    host: true,
    port: 4321,
  },
  build: {
    concurrency: 8,
  },
  adapter: cloudflare({
    platform: "workers",
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
    },
    routes: {
      extend: {
        exclude: [
          { pattern: "/_astro/*" },
          { pattern: "/assets/*" },
          { pattern: "/pagefind/*" },
        ],
      },
    },
  }),
  session: {
    driver: {
      entrypoint: "unstorage/drivers/memory",
    },
  },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "connect-src 'self' blob:",
        "font-src 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "img-src 'self' data: https:",
        "object-src 'none'",
        "worker-src 'self' blob:",
      ],
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
      styleDirective: {
        resources: [
          "'self'",
          // `style-src-attr` only governs `style=""` attributes, which cannot
          // execute code. Author-written inline styles across the pages need
          // it; `<style>` blocks and stylesheets stay on 'self' + hashes.
          { resource: "'unsafe-inline'", kind: "attribute" },
        ],
      },
    },
  },
  markdown: {
    syntaxHighlight: "prism",
  },
  integrations: [react(), icon(), mdx(), robotsTxt()],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      reportCompressedSize: false,
      target: "es2022",
      cssMinify: "lightningcss",
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
    oxc: {
      // @vitejs/plugin-react (pulled in by @astrojs/react) registers a
      // react-refresh filter that matches any id ending in .ts/.tsx, query
      // string included. Astro's client `<script>` modules are served as
      // `Foo.astro?astro&type=script&index=0&lang.ts`, so they match, and
      // Vite's oxc plugin then forces `lang: "js"` on them because the id
      // without its query ends in `.astro`. That drops TypeScript support
      // inside every `<script>` block. Excluding those ids restores it.
      jsxRefreshExclude: [/[?&]astro&type=script/],
    },
    ssr: {
      external: ["node:crypto", "node:fs/promises", "node:path", "node:url"],
      // The dev SSR environment is workerd, which has no CommonJS support.
      // Pre-bundle the CJS dependencies that reach the worker (@iconify/utils
      // pulls in `debug`, which is CJS-only) so Vite hands the module runner
      // ESM instead of code that references `module.exports`.
      optimizeDeps: {
        include: ["@iconify/utils"],
      },
    },
  },
});
