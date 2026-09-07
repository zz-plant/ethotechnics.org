import { expect, test } from "@playwright/test";

/**
 * Content assertions on one page from every route family that used to be
 * prerendered.
 *
 * These are the pages that shipped as a 15-byte "[object Object]" for months
 * (docs/planning/prerender-finding-2026-09.md). Nothing caught it because they
 * returned HTTP 200 and no e2e case visited any of them. A status code cannot
 * tell a rendered page from an empty one, so every assertion here is about
 * what is on the page.
 */

const PAGES = [
  { path: "/audit", family: "audit" },
  { path: "/glossary/stoppability", family: "glossary entry" },
  { path: "/evals/stoppability", family: "eval suite" },
  { path: "/evidence-packs/std-01", family: "evidence pack" },
  { path: "/explainers/contestability-checklist", family: "explainer" },
  { path: "/incidents/appeals-backlog-trigger", family: "incident" },
  {
    path: "/research/theory/absorption-as-concealment",
    family: "theory essay",
  },
  { path: "/taxonomy/governance", family: "taxonomy entry" },
  { path: "/experience/consent", family: "taxonomy branch entry" },
];

const NOT_FOUND = [
  "/glossary/does-not-exist",
  "/evals/does-not-exist",
  "/evidence-packs/does-not-exist",
  "/explainers/does-not-exist",
  "/incidents/does-not-exist",
  "/research/theory/does-not-exist",
  "/taxonomy/does-not-exist",
  "/experience/does-not-exist",
];

test.describe("Detail pages render their content", () => {
  for (const { path, family } of PAGES) {
    test(`${family} at ${path}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      // The specific failure this guards against: a 200 whose body is a
      // stringified object. Assert real structure, not a status code.
      await expect(page.locator("h1")).toHaveCount(1);
      const heading = (await page.locator("h1").textContent())?.trim() ?? "";
      expect(heading.length).toBeGreaterThan(2);
      expect(heading).not.toContain("[object Object]");

      const body = (await page.locator("body").textContent()) ?? "";
      expect(body.length).toBeGreaterThan(500);
      expect(body).not.toContain("[object Object]");
    });
  }

  test("unknown slugs 404 rather than rendering an empty page", async ({
    page,
  }) => {
    for (const path of NOT_FOUND) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should 404`).toBe(404);
    }
  });
});
