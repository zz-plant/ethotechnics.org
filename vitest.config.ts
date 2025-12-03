import { defineConfig, getViteConfig } from "astro/config";

const resolvedViteConfig = await getViteConfig({})({
  mode: "test",
  command: "serve",
});
const resolvedTestConfig = (
  resolvedViteConfig as { test?: { exclude?: string[] } }
).test;

export default defineConfig({
  ...resolvedViteConfig,
  test: {
    ...resolvedTestConfig,
    environment: "node",
    globals: true,
    globalSetup: ["src/test/global-setup.ts"],
    setupFiles: ["src/test/setup.ts"],
    exclude: [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      ...(resolvedTestConfig?.exclude ?? []),
      "tests/e2e/**",
    ],
    deps: {
      inline: ["astro", "@astrojs/react"],
    },
  },
} as unknown as import("astro").AstroUserConfig);
