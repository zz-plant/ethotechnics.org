import { expect, test } from "@playwright/test";

const FORECASTER_URL = "/diagnostics/capacity-forecaster";

test.describe("Capacity Forecaster page", () => {
  test("responds with status 200", async ({ request }) => {
    const response = await request.get(FORECASTER_URL);
    expect(response.status()).toBe(200);
  });

  test("has proper title and description", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await expect(page).toHaveTitle(/Technical Capacity Forecaster.+Diagnostics/);
    await expect(
      page.locator('meta[name="description"]'),
    ).toHaveAttribute("content", /.+/);
  });

  test("renders the widget with header content", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    const widget = page.locator(".forecaster");
    await expect(widget).toBeVisible();
    await expect(
      widget.getByRole("heading", { level: 2 }),
    ).toContainText("Simulate decay");
  });

  test("renders the SVG capacity chart", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    const chart = page.locator(".forecaster__chart-svg");
    await expect(chart).toBeVisible();
    await expect(chart.locator(".forecaster__chart-line--baseline")).toBeVisible();
  });

  test("displays input levers with sliders", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Input levers")).toBeVisible();
    await expect(page.getByText("Velocity index")).toBeVisible();
    await expect(page.getByText("Interruption rate")).toBeVisible();
    await expect(
      page.locator('.forecaster__range').first(),
    ).toBeVisible();
  });

  test("shows scenario metrics below the chart", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Scenario A")).toBeVisible();
    await expect(page.getByText("Saturation point")).toBeVisible();
    await expect(page.getByText("Baseline capacity at horizon")).toBeVisible();
    await expect(page.getByText("Remediated capacity at horizon")).toBeVisible();
  });

  test("shows chart legend entries", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    const legend = page.locator(".forecaster__chart-legend");
    await expect(legend).toBeVisible();
    await expect(legend.getByText("Scenario A: baseline")).toBeVisible();
    await expect(legend.getByText("Scenario A: remediated")).toBeVisible();
  });

  test("displays stability profile options", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Stability profile")).toBeVisible();
    await expect(page.getByRole("button", { name: "Stable" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Brittle" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Unstable" })).toBeVisible();
  });

  test("slider changes update chart and metrics", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    const velocitySlider = page.locator('.forecaster__range').first();
    const initialValue = page.locator(".pill--ghost").first();

    await velocitySlider.fill("70");
    await page.waitForTimeout(200);

    expect(Number(await initialValue.textContent())).toBe(70);
  });

  test("switches to compare mode and shows scenario B", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Compare" }).click();

    await expect(page.getByText("Export comparison")).toBeVisible();
    await expect(page.getByText("Scenario B")).toBeVisible();
    await expect(page.getByText("Mirror A → B")).toBeVisible();
    await expect(page.getByText("Mirror B → A")).toBeVisible();

    await expect(
      page.locator(".forecaster__chart-line--baseline-b"),
    ).toBeVisible();
  });

  test("compare mode shows delta highlights and summary table", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Compare" }).click();

    await expect(page.getByText("Delta highlights")).toBeVisible();
    await expect(page.getByText("Scenario A vs B summary")).toBeVisible();
  });

  test("resets from compare back to single scenario", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Compare" }).click();
    await page.getByRole("button", { name: "Reset to single scenario" }).first().click();

    await expect(
      page.getByRole("button", { name: "Export comparison" }),
    ).toBeDisabled();
  });

  test("stability selection changes active state", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    const brittleBtn = page.getByRole("button", { name: "Brittle" });
    await brittleBtn.click();

    await expect(brittleBtn).toHaveAttribute("aria-pressed", "true");
  });
});
