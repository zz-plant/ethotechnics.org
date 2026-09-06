import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const SIMULATOR_URL = "/diagnostics/maintenance-simulator";

// The widget is a `client:visible` island below the fold, so it only hydrates
// once scrolled into view. Hydration syncs the simulation state into the query
// string, which is the signal that the React handlers are wired up.
const openHydratedSimulator = async (page: Page) => {
  await page.goto(SIMULATOR_URL);
  await page.waitForLoadState("networkidle");
  await page.locator(".simulator").scrollIntoViewIfNeeded();
  await page.waitForURL(/[?&]scenario=/);
};

test.describe("Maintenance Simulator page", () => {
  test("responds with status 200", async ({ request }) => {
    const response = await request.get(SIMULATOR_URL);
    expect(response.status()).toBe(200);
  });

  test("has proper title and description", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await expect(page).toHaveTitle(/Maintenance Simulator.+Diagnostics/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
  });

  test("renders the widget with intro content", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await page.waitForLoadState("networkidle");

    const widget = page.locator(".simulator");
    await expect(widget).toBeVisible();
    await expect(widget.getByRole("heading", { level: 1 })).toContainText(
      "Tabletop the outage",
    );
  });

  test("shows scenario, stress, and threshold selectors", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.getByLabel("Select simulation scenario")).toBeVisible();
    await expect(page.getByLabel("Set simulation stress level")).toBeVisible();
    await expect(
      page.getByLabel("Select readiness threshold preset"),
    ).toBeVisible();
  });

  test("displays export buttons", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("button", { name: "Export JSON" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Export PDF" }),
    ).toBeVisible();
  });

  test("shows scenario template summary", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await page.waitForLoadState("networkidle");

    const templateSummary = page.locator(".simulator__template");
    await expect(templateSummary).toBeVisible();
    await expect(
      templateSummary.getByText("Time to halt expectation"),
    ).toBeVisible();
    await expect(
      templateSummary.getByText("Stress signals to watch"),
    ).toBeVisible();
  });

  test("shows coverage toggles", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await page.waitForLoadState("networkidle");

    const controlsGroup = page.locator(
      '[aria-label="Coverage items to include"]',
    );
    await expect(controlsGroup).toBeVisible();

    const checkboxes = controlsGroup.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("shows readiness score panel", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Coverage score")).toBeVisible();

    const readinessTitle = page.locator("#readiness-title");
    await expect(readinessTitle).toBeVisible();
    const scoreText = await readinessTitle.textContent();
    expect(scoreText).toMatch(/\d+% ready to run/);
  });

  test("shows threshold bands panel", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Readiness thresholds")).toBeVisible();
    await expect(page.getByText("Threshold bands")).toBeVisible();
    await expect(
      page.getByText("Recommended interventions", { exact: true }),
    ).toBeVisible();
  });

  test("toggling coverage checkbox changes readiness score", async ({
    page,
  }) => {
    await openHydratedSimulator(page);

    const readinessTitle = page.locator("#readiness-title");
    const readinessBefore = (await readinessTitle.textContent()) ?? "";

    const firstCheckbox = page
      .locator('[aria-label="Simulation controls"] input[type="checkbox"]')
      .first();
    await firstCheckbox.uncheck();

    await expect(readinessTitle).not.toHaveText(readinessBefore);

    await firstCheckbox.check();
    await expect(readinessTitle).toHaveText(readinessBefore);
  });

  test("changing scenario updates template summary", async ({ page }) => {
    await openHydratedSimulator(page);

    const initialHeading = page.locator(".simulator__template h2");
    const initialText = await initialHeading.textContent();

    await page
      .getByLabel("Select simulation scenario")
      .selectOption({ index: 2 });

    const updatedHeading = page.locator(".simulator__template h2");
    expect(await updatedHeading.textContent()).not.toBe(initialText);
  });

  test("changing stress level updates the description", async ({ page }) => {
    await openHydratedSimulator(page);

    const initialDesc = await page
      .locator(".simulator__risk-description")
      .textContent();

    await page
      .getByLabel("Set simulation stress level")
      .selectOption("critical");

    const updatedDesc = await page
      .locator(".simulator__risk-description")
      .textContent();
    expect(updatedDesc).not.toBe(initialDesc);
    expect(updatedDesc).toMatch(/high-stress/i);
  });

  test("shows stage cards for the runbook", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Runbook", { exact: true })).toBeVisible();
    await expect(page.getByText("Play through the stages")).toBeVisible();

    const stageCards = page.locator(".simulator__card--stage");
    const count = await stageCards.count();
    expect(count).toBeGreaterThanOrEqual(2);

    const firstStage = stageCards.first();
    await expect(
      firstStage.getByText("Actions", { exact: true }),
    ).toBeVisible();
    await expect(
      firstStage.getByText("Blockers", { exact: true }),
    ).toBeVisible();
  });

  test("shows communication table with copy buttons", async ({ page }) => {
    await page.goto(SIMULATOR_URL);
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText("Communications", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Keep communications on cadence"),
    ).toBeVisible();

    const copyButtons = page.locator(".simulator__copy-button");
    const count = await copyButtons.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstCopy = copyButtons.first();
    await expect(firstCopy).toBeVisible();
    await expect(firstCopy).toHaveText("Copy message");
  });

  test("exports JSON triggers a download", async ({ page }) => {
    await openHydratedSimulator(page);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export JSON" }).click(),
    ]);

    expect(download.suggestedFilename()).toContain("maintenance-simulation");
    expect(download.suggestedFilename()).toContain(".json");
  });
});
