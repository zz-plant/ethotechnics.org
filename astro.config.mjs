import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://ethotechnics.org',
  output: 'server',
  server: {
    host: true,
    port: 4321,
  },
  adapter: cloudflare({
    platform: 'workers',
    imageService: 'cloudflare',
    routes: {
      extend: {
        exclude: [{ pattern: '/_astro/*' }, { pattern: '/assets/*' }],
      },
    },
  }),
  session: {
    driver: 'memory',
  },
  markdown: {
    syntaxHighlight: 'prism',
  },
  integrations: [react(), icon(), mdx(), sitemap(), robotsTxt()],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      cssMinify: 'lightningcss',
      minify: 'esbuild',
      reportCompressedSize: false,
      target: 'es2022',
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 1000,
        },
      },
    },
    esbuild: {
      target: 'es2022',
      legalComments: 'none',
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    ssr: {
      external: ['node:crypto', 'node:fs/promises', 'node:path', 'node:url'],
    },
  },
});
