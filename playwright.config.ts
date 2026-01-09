import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.CF_PAGES_URL ??
  process.env.PLAYWRIGHT_BASE_URL ??
  "http://127.0.0.1:4321";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: process.env.CF_PAGES_URL
    ? undefined
    : {
        command: "bun run preview -- --host 0.0.0.0 --port 4321",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
