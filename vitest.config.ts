import { defineConfig, getViteConfig } from 'astro/config';

const resolvedViteConfig = await getViteConfig({})({ mode: 'test', command: 'serve' });

export default defineConfig({
  ...resolvedViteConfig,
  test: {
    environment: 'node',
    globals: true,
    globalSetup: ['src/test/global-setup.ts'],
    setupFiles: ['src/test/setup.ts'],
    deps: {
      inline: ['astro', '@astrojs/react'],
    },
  },
} as unknown as import('astro').AstroUserConfig);
