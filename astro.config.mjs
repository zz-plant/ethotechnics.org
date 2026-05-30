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
        exclude: [{ pattern: "/_astro/*" }, { pattern: "/assets/*" }],
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
        "connect-src 'self'",
        "font-src 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "img-src 'self' data: https:",
        "object-src 'none'",
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
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
      minify: "esbuild",
      reportCompressedSize: false,
      target: ["es2022"],
      cssMinify: "lightningcss",
      cssTarget: ["es2020"],
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 1000,
        },
      },
    },
    esbuild: {
      target: "es2022",
      legalComments: "none",
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
    ssr: {
      external: ["node:crypto", "node:fs/promises", "node:path", "node:url"],
    },
  },
});
