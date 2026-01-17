import { expect, test, type Page } from "@playwright/test";

type ConsoleMessage = {
  type: string;
  text: string;
};

const CORE_ROUTES = ["/", "/standards", "/library", "/start-here"];

const collectConsoleMessages = (page: Page) => {
  const messages: ConsoleMessage[] = [];

  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) {
      messages.push({ type: message.type(), text: message.text() });
    }
  });

  page.on("pageerror", (error) => {
    messages.push({ type: "pageerror", text: error.message });
  });

  return messages;
};

test.describe("Quality guardrails", () => {
  test("core routes log no console warnings or errors", async ({ page }) => {
    const messages = collectConsoleMessages(page);

    for (const route of CORE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
    }

    expect(messages).toEqual([]);
  });

  test("homepage meets core web vital budgets", async ({ page }) => {
    await page.addInitScript(() => {
      window.__metrics = { cls: 0, lcp: 0 };

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!shiftEntry.hadRecentInput) {
            window.__metrics.cls += shiftEntry.value ?? 0;
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          window.__metrics.lcp = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(() => window.__metrics);

    expect(metrics.cls).toBe(0);
    expect(metrics.lcp).toBeGreaterThan(0);
    expect(metrics.lcp).toBeLessThan(2500);
  });
});

declare global {
  interface Window {
    __metrics: { cls: number; lcp: number };
  }
}
