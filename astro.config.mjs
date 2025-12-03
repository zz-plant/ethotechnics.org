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
  integrations: [react(), icon(), mdx(), sitemap(), robotsTxt()],
});
