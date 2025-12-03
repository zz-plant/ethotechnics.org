import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ethotechnics.org',
  output: 'server',
  adapter: cloudflare({
    platform: 'workers',
  }),
  session: {
    driver: 'memory',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/compile',
    },
  },
  integrations: [react(), icon(), mdx(), sitemap()],
});
