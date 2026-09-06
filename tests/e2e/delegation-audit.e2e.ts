import { expect, test } from "@playwright/test";

const AUDIT_URL = "/diagnostics/delegation-audit";

test.describe("Delegation Audit page", () => {
  test("responds with status 200", async ({ request }) => {
    const response = await request.get(AUDIT_URL);
    expect(response.status()).toBe(200);
  });

  test("has proper title and description", async ({ page }) => {
    await page.goto(AUDIT_URL);
    await expect(page).toHaveTitle(/Delegation Audit.+Diagnostics/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
  });

  test("renders the island with the workflow field", async ({ page }) => {
    await page.goto(AUDIT_URL);
    await page.waitForLoadState("networkidle");

    const widget = page.locator("[data-delegation-audit]");
    await expect(widget).toBeVisible();
    await expect(page.locator("#da-workflow")).toBeVisible();
  });

  test("shows the exposure score and its three factors", async ({ page }) => {
    await page.goto(AUDIT_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".delegation-audit__score-value")).toBeVisible();
    await expect(page.locator(".delegation-audit__factor")).toHaveCount(3);
    await expect(
      page.getByText("workflow staff-week hours", { exact: false }).first(),
    ).toBeVisible();
  });

  test("recomputes the exposure score when substitution cost changes", async ({
    page,
  }) => {
    await page.goto(AUDIT_URL);
    await page.waitForLoadState("networkidle");

    const score = page.locator(".delegation-audit__score-value");
    const before = await score.textContent();

    await page.locator("#da-substitution").fill("20");

    await expect(score).not.toHaveText(before ?? "");
  });

  test("lists the six state variables and the reversibility ladder", async ({
    page,
  }) => {
    await page.goto(AUDIT_URL);
    await page.waitForLoadState("networkidle");

    await expect(
      page.locator(".delegation-audit__variable-name"),
    ).not.toHaveCount(0);
    await expect(page.locator(".delegation-audit__rung")).toHaveCount(3);
    await expect(page.getByText("(weakest level)")).toBeVisible();
  });

  test("exports a JSON snapshot", async ({ page }) => {
    await page.goto(AUDIT_URL);
    await page.waitForLoadState("networkidle");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export JSON" }).click(),
    ]);
    expect(download.suggestedFilename()).toContain("delegation-audit");
  });
});
