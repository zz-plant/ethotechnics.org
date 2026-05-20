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
  adapter: cloudflare({
    platform: "workers",
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
      configPath: "./wrangler.toml",
    },
    routes: {
      extend: {
        exclude: [{ pattern: "/_astro/*" }, { pattern: "/assets/*" }],
      },
    },
  }),
  session: {
    driver: "memory",
    // Note: Astro 6 uses object-form session driver config per migration guide
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
