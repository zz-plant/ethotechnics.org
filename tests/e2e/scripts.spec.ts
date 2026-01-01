import { expect, test } from "@playwright/test";

test.describe("Production scripts", () => {
  test("keeps the pattern filter and bundle controls working", async ({ page }) => {
    await page.goto("/library#patterns");
    await page.waitForSelector("[data-pattern-filter]");

    const designEthics = page.getByRole("button", { name: "Design ethics" });
    const decisionLog = page.locator("#decision-log");
    const appealPaths = page.locator("#appeal-paths");
    const progressiveConsent = page.locator("#progressive-consent");
    const filterStatus = page.locator("[data-filter-status]");

    await designEthics.click();
    await expect(filterStatus).toContainText(/Design ethics/);
    await expect(decisionLog).toBeHidden();
    await expect(appealPaths).toBeVisible();

    await page
      .getByLabel("Search patterns by title, summary, or cue")
      .fill("appeal");
    await expect(filterStatus).toContainText(/appeal/);
    await expect(appealPaths).toBeVisible();
    await expect(progressiveConsent).toBeHidden();

    const bundleStatus = page.locator("[data-selection-status]");
    await expect(bundleStatus).toContainText("No patterns selected yet.");

    await page
      .getByLabel("Save Appeal paths inside the UI to your bundle")
      .check();

    await expect(bundleStatus).toContainText("1 pattern saved");
    await expect(page.getByRole("button", { name: "Download markdown" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Copy bundle link" })).toBeEnabled();
  });

  test("filters glossary entries and restores the full index", async ({ page }) => {
    await page.goto("/glossary");

    const input = page.getByPlaceholder(
      "Start typing to narrow the index (e.g., consent)",
    );
    const count = page.locator(".glossary-filter__count");
    const empty = page.locator(".glossary-index__empty");
    const consentJourney = page
      .locator(".glossary-index__item")
      .filter({ hasText: "Consent Journey" });
    const burdenIndex = page
      .locator(".glossary-index__item")
      .filter({ hasText: "Burden Index" });

    const initialCount = await count.textContent();

    await input.fill("consent");
    await expect(count).not.toHaveText(initialCount ?? "");
    await expect(consentJourney).toBeVisible();
    await expect(burdenIndex).toHaveClass(/is-hidden/);
    await expect(empty).toBeHidden();

    await input.fill("no-matching-term");
    await expect(count).toContainText("Showing 0");
    await expect(empty).toBeVisible();

    await page.getByRole("button", { name: "Clear filter" }).click();
    await expect(input).toHaveValue("");
    await expect(empty).toBeHidden();
    await expect(burdenIndex).not.toHaveClass(/is-hidden/);
  });

  test("activates field note tabs when navigating by hash", async ({ page }) => {
    await page.goto("/field-notes");

    const dispatchTab = page.getByRole("tab", { name: "Dispatches" });
    const caseStudiesTab = page.getByRole("tab", { name: "Case studies" });
    const dispatchPanel = page.locator(
      "[data-field-notes-panel][data-format=\"dispatch\"]",
    );
    const caseStudyPanel = page.locator(
      "[data-field-notes-panel][data-format=\"case-study\"]",
    );

    await expect(dispatchTab).toHaveAttribute("aria-selected", "true");
    await expect(dispatchPanel).toBeVisible();

    await caseStudiesTab.click();
    await expect(caseStudiesTab).toHaveAttribute("aria-selected", "true");
    await expect(caseStudyPanel).toBeVisible();
    await expect(dispatchPanel).toBeHidden();
    await expect(page).toHaveURL(/#case-study/);

    await page.goto("/field-notes#maintenance-drift");
    const signalsTab = page.getByRole("tab", { name: "Signals" });
    const signalPanel = page.locator(
      "[data-field-notes-panel][data-format=\"signal\"]",
    );
    const maintenanceEntry = page.locator("#maintenance-drift");

    await expect(signalsTab).toHaveAttribute("aria-selected", "true");
    await expect(signalPanel).toBeVisible();
    await expect(maintenanceEntry).toBeVisible();
  });
});
