import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const FORECASTER_URL = "/diagnostics/capacity-forecaster";

// The widget is a `client:visible` island near the bottom of the page, so it
// only hydrates once scrolled into view. Hydration syncs the scenario state
// into the query string, which is the signal that handlers are wired up.
const openHydratedForecaster = async (page: Page) => {
  await page.goto(FORECASTER_URL);
  await page.waitForLoadState("networkidle");
  await page.locator(".forecaster").scrollIntoViewIfNeeded();
  await page.waitForURL(/[?&]velocity=/);
};

test.describe("Capacity Forecaster page", () => {
  test("responds with status 200", async ({ request }) => {
    const response = await request.get(FORECASTER_URL);
    expect(response.status()).toBe(200);
  });

  test("has proper title and description", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await expect(page).toHaveTitle(
      /Technical Capacity Forecaster.+Diagnostics/,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
  });

  test("renders the widget with header content", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    const widget = page.locator(".forecaster");
    await expect(widget).toBeVisible();
    await expect(widget.getByRole("heading", { level: 2 })).toContainText(
      "Simulate decay",
    );
  });

  test("renders the SVG capacity chart", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    const chart = page.locator(".forecaster__chart-svg");
    await expect(chart).toBeVisible();
    await expect(
      chart.locator(".forecaster__chart-line--baseline"),
    ).toBeVisible();
  });

  test("displays input levers with sliders", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Input levers")).toBeVisible();
    await expect(page.getByText("Velocity index")).toBeVisible();
    await expect(page.getByText("Interruption rate")).toBeVisible();
    await expect(page.locator(".forecaster__range").first()).toBeVisible();
  });

  test("shows scenario metrics below the chart", async ({ page }) => {
    await page.goto(FORECASTER_URL);
    await page.waitForLoadState("networkidle");

    const meta = page.locator(".forecaster__meta");
    await expect(meta.getByText("Scenario A")).toBeVisible();
    await expect(meta.getByText("Saturation point")).toBeVisible();
    await expect(meta.getByText("Baseline capacity at horizon")).toBeVisible();
    await expect(
      meta.getByText("Remediated capacity at horizon"),
    ).toBeVisible();
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
    await expect(page.getByRole("button", { name: "RESILIENT" })).toBeVisible();
    await expect(page.getByRole("button", { name: "DEGRADED" })).toBeVisible();
    await expect(page.getByRole("button", { name: "UNSTABLE" })).toBeVisible();
  });

  test("slider changes update chart and metrics", async ({ page }) => {
    await openHydratedForecaster(page);

    const velocitySlider = page.locator(".forecaster__range").first();
    const velocityReadout = page.getByLabel("Velocity index numeric input");
    const baselineAtHorizon = page
      .locator(".forecaster__meta-item")
      .filter({ hasText: "Baseline capacity at horizon" })
      .locator(".forecaster__meta-value");

    const baselineBefore = await baselineAtHorizon.textContent();
    await expect(velocityReadout).not.toHaveValue("70");

    await velocitySlider.fill("70");

    await expect(velocityReadout).toHaveValue("70");
    await expect(baselineAtHorizon).not.toHaveText(baselineBefore ?? "");
  });

  test("switches to compare mode and shows scenario B", async ({ page }) => {
    await openHydratedForecaster(page);

    await page.getByRole("button", { name: "Compare", exact: true }).click();

    await expect(
      page.getByRole("button", { name: "Export comparison" }),
    ).toBeEnabled();
    await expect(
      page.locator(".forecaster__meta").getByText("Scenario B"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Mirror A → B" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Mirror B → A" }),
    ).toBeVisible();

    await expect(
      page.locator(".forecaster__chart-line--baseline-b"),
    ).toBeVisible();
  });

  test("compare mode shows delta highlights and summary table", async ({
    page,
  }) => {
    await openHydratedForecaster(page);

    await page.getByRole("button", { name: "Compare", exact: true }).click();

    await expect(page.getByText("Delta highlights")).toBeVisible();
    await expect(page.getByText("Scenario A vs B summary")).toBeVisible();
  });

  test("resets from compare back to single scenario", async ({ page }) => {
    await openHydratedForecaster(page);

    await page.getByRole("button", { name: "Compare", exact: true }).click();
    await page
      .getByRole("button", { name: "Reset to single scenario" })
      .first()
      .click();

    await expect(
      page.getByRole("button", { name: "Export comparison" }),
    ).toBeDisabled();
  });

  test("stability selection changes active state", async ({ page }) => {
    await openHydratedForecaster(page);

    const resilientBtn = page.getByRole("button", { name: "RESILIENT" });
    const degradedBtn = page.getByRole("button", { name: "DEGRADED" });
    await expect(resilientBtn).toHaveAttribute("aria-pressed", "false");

    await resilientBtn.click();

    await expect(resilientBtn).toHaveAttribute("aria-pressed", "true");
    await expect(degradedBtn).toHaveAttribute("aria-pressed", "false");
  });
});
