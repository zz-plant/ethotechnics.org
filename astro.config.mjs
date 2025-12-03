import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://example.com',
  integrations: [react(), icon()],
});
