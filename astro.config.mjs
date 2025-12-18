import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://ethotechnics.org',
  viewTransitions: true,
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
  integrations: [icon(), mdx(), sitemap(), robotsTxt()],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
