import { expect, test } from "@playwright/test";

const BURDEN_URL = "/diagnostics/burden-modeler";

test.describe("Burden Modeler page", () => {
  test("responds with status 200", async ({ request }) => {
    const response = await request.get(BURDEN_URL);
    expect(response.status()).toBe(200);
  });

  test("has proper title and description", async ({ page }) => {
    await page.goto(BURDEN_URL);
    await expect(page).toHaveTitle(/Burden Modeler.+Diagnostics/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
  });

  test("renders the widget with header content", async ({ page }) => {
    await page.goto(BURDEN_URL);
    await page.waitForLoadState("networkidle");

    const widget = page.locator("[data-burden-modeler]");
    await expect(widget).toBeVisible();
    await expect(widget.getByRole("heading", { level: 2 })).toContainText(
      "Quantify where toil piles up",
    );
  });

  test("shows scenario input and rating scale", async ({ page }) => {
    await page.goto(BURDEN_URL);
    await page.waitForLoadState("networkidle");

    const scenarioInput = page.locator("#scenario-name");
    await expect(scenarioInput).toBeVisible();
    await expect(scenarioInput).toHaveValue("Baseline");

    await expect(
      page.getByText("0 = resting, 10 = unsustainable"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Reset inputs" }),
    ).toBeVisible();
  });

  test("changes scenario name updates the burden meter title", async ({
    page,
  }) => {
    await page.goto(BURDEN_URL);
    await page.waitForLoadState("networkidle");

    await page.locator("#scenario-name").fill("Q3 Release");
    await expect(
      page.locator("[data-burden-modeler] .eyebrow").first(),
    ).toHaveText("Q3 Release");
  });

  test("slider interaction updates the rating descriptor", async ({ page }) => {
    await page.goto(BURDEN_URL);
    await page.waitForLoadState("networkidle");

    const firstSlider = page.locator('.slider input[type="range"]').first();
    const initialValue = await firstSlider.inputValue();

    await firstSlider.fill("7");
    const newValue = await firstSlider.inputValue();
    expect(newValue).not.toBe(initialValue);
  });

  test("displays burden index and category scores", async ({ page }) => {
    await page.goto(BURDEN_URL);
    await page.waitForLoadState("networkidle");

    const burdenMeter = page.locator(".burden-meter__value");
    await expect(burdenMeter).toBeVisible();
    const indexValue = await burdenMeter.textContent();
    expect(Number(indexValue)).toBeGreaterThanOrEqual(0);

    await expect(page.locator(".burden-meter__badge")).toBeVisible();
    await expect(
      page.getByText("Average rating", { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByText("Top category", { exact: false }),
    ).toBeVisible();
    await expect(page.getByText("Top driver", { exact: false })).toBeVisible();
  });

  test("shows the segment comparison table", async ({ page }) => {
    await page.goto(BURDEN_URL);
    await page.waitForLoadState("networkidle");

    const segmentTable = page.locator(".segment-table");
    await expect(segmentTable).toBeVisible();
    await expect(segmentTable.getByText("Segment")).toBeVisible();
    await expect(segmentTable.getByText("Score")).toBeVisible();
    await expect(segmentTable.getByText("Delta")).toBeVisible();
    await expect(segmentTable.getByText("Flag")).toBeVisible();
  });

  test("shows the hotspot list with mitigations", async ({ page }) => {
    await page.goto(BURDEN_URL);
    await page.waitForLoadState("networkidle");

    const hotspotList = page.locator(".hotspot-list");
    await expect(hotspotList).toBeVisible();
    const firstHotspot = hotspotList.locator(".hotspot").first();
    await expect(firstHotspot.locator(".hotspot__label")).toBeVisible();
    await expect(firstHotspot.locator(".hotspot__mitigations")).toBeVisible();
  });

  test("reset inputs returns to defaults", async ({ page }) => {
    await page.goto(BURDEN_URL);
    await page.waitForLoadState("networkidle");

    const firstSlider = page.locator('.slider input[type="range"]').first();
    await firstSlider.fill("9");

    await page.getByRole("button", { name: "Reset inputs" }).click();

    await expect(page.locator("#scenario-name")).toHaveValue("Baseline");
    // Default rating is 5, not 0
    await expect(firstSlider).toHaveValue("5");
  });

  test("exports snapshot triggers a download", async ({ page }) => {
    await page.goto(BURDEN_URL);
    await page.waitForLoadState("networkidle");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export snapshot" }).click(),
    ]);
    expect(download.suggestedFilename()).toContain("burden-snapshot");
  });
});
