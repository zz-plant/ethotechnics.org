import { defineConfig, getViteConfig } from 'astro/config';

const resolvedViteConfig = await getViteConfig({})({ mode: 'test', command: 'serve' });

export default defineConfig({
  ...resolvedViteConfig,
  test: {
    environment: 'jsdom',
    globals: true,
  },
} as unknown as import('astro').AstroUserConfig);
