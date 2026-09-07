import { expect, test } from "@playwright/test";

test.describe("Production scripts", () => {
  test("keeps the mechanism filter and bundle controls working", async ({
    page,
  }) => {
    await page.goto("/library#patterns");
    await page.waitForSelector("[data-pattern-filter]");

    const filterStatus = page.locator("[data-filter-status]");
    // The mechanism filter boots lazily once the section scrolls into view;
    // the status line switches to a live count when the script takes over.
    await page.locator("[data-pattern-filter]").scrollIntoViewIfNeeded();
    await expect(filterStatus).toContainText(
      /mechanisms visible with All themes\./,
    );

    const friction = page.getByRole("button", {
      name: "Filter mechanisms by Friction and update visible results",
    });
    // MEC-01 is Governance + Policy, MEC-06 is Friction + Governance,
    // MEC-02 is Friction + Policy.
    const decisionLog = page.locator("#decision-log");
    const appealPaths = page.locator("#appeal-paths");
    const progressiveConsent = page.locator("#progressive-consent");

    await friction.click();
    await expect(friction).toHaveAttribute("aria-pressed", "true");
    await expect(filterStatus).toContainText(
      "5 mechanisms visible with Friction.",
    );
    await expect(appealPaths).toBeVisible();
    await expect(decisionLog).toBeHidden();

    await page
      .getByLabel("Search mechanisms by title, summary, or cue")
      .fill("appeal");
    await expect(filterStatus).toContainText(
      '2 mechanisms visible with Friction and search for "appeal".',
    );
    await expect(appealPaths).toBeVisible();
    await expect(progressiveConsent).toBeHidden();

    const bundleStatus = page.locator("[data-selection-status]");
    await expect(bundleStatus).toContainText("No mechanisms selected yet.");

    await page
      .getByLabel("Save MEC-06 Appeal paths inside the UI to your bundle")
      .check();

    await expect(bundleStatus).toContainText(
      "1 mechanism saved for your bundle.",
    );
    await expect(
      page.getByRole("button", { name: "Download markdown" }),
    ).toHaveAttribute("aria-disabled", "false");
    await expect(
      page.getByRole("button", { name: "Copy bundle link" }),
    ).toHaveAttribute("aria-disabled", "false");
  });

  test("filters glossary entries and restores the full index", async ({
    page,
  }) => {
    await page.goto("/glossary");

    const input = page.getByLabel("Filter glossary terms", { exact: true });
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

  test("activates field note tabs when navigating by hash", async ({
    page,
  }) => {
    await page.goto("/field-notes");

    const dispatchTab = page.getByRole("tab", { name: "Dispatches" });
    const caseStudiesTab = page.getByRole("tab", { name: "Case studies" });
    const dispatchPanel = page.locator(
      '[data-field-notes-panel][data-format="dispatch"]',
    );
    const caseStudyPanel = page.locator(
      '[data-field-notes-panel][data-format="case-study"]',
    );

    await expect(dispatchTab).toHaveAttribute("aria-selected", "true");
    await expect(dispatchPanel).toBeVisible();

    await caseStudiesTab.click();
    await expect(caseStudiesTab).toHaveAttribute("aria-selected", "true");
    await expect(dispatchTab).toHaveAttribute("aria-selected", "false");
    await expect(caseStudyPanel).toBeVisible();
    await expect(page).toHaveURL(/\?tab=case-study/);
    await expect(dispatchPanel).toBeHidden();

    await page.goto("/field-notes#maintenance-drift");
    const signalsTab = page.getByRole("tab", { name: "Signals" });
    const signalPanel = page.locator(
      '[data-field-notes-panel][data-format="signal"]',
    );
    const maintenanceEntry = page.locator("#maintenance-drift");

    await expect(signalsTab).toHaveAttribute("aria-selected", "true");
    await expect(signalPanel).toBeVisible();
    await expect(maintenanceEntry).toBeVisible();
  });
});
