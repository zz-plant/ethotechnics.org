import { expect, test } from "@playwright/test";

import { libraryContent } from "../../src/content/library";
import { buildPatternSearchText } from "../../src/utils/pattern-search";

// Expected counts come from the same data and search index the page renders,
// so adding a mechanism does not silently break this test.
const correctionMechanisms = libraryContent.patterns.entries.filter((pattern) =>
  pattern.filters.includes("correction"),
);
const correctionAppealMechanisms = correctionMechanisms.filter((pattern) =>
  buildPatternSearchText(pattern).includes("appeal"),
);
const countLabel = (count: number) =>
  `${count} ${count === 1 ? "mechanism" : "mechanisms"}`;

test.describe("Production scripts", () => {
  test("keeps the mechanism filter working", async ({ page }) => {
    await page.goto("/mechanisms");
    await page.waitForSelector("[data-pattern-filter]");

    const filterStatus = page.locator("[data-filter-status]");
    // The mechanism filter boots lazily once the section scrolls into view;
    // the status line switches to a live count when the script takes over.
    await page.locator("[data-pattern-filter]").scrollIntoViewIfNeeded();
    await expect(filterStatus).toContainText(
      /mechanisms visible with All safeguards\./,
    );

    const correction = page.getByRole("button", {
      name: "Filter mechanisms by Correction and update visible results",
    });
    // MEC-01 is Authority + Evidence, MEC-06 is Standing + Correction,
    // MEC-02 is Standing + Dependency.
    const decisionLog = page.locator("#decision-log");
    const appealPaths = page.locator("#appeal-paths");
    const progressiveConsent = page.locator("#progressive-consent");

    await correction.click();
    await expect(correction).toHaveAttribute("aria-pressed", "true");
    await expect(filterStatus).toContainText(
      `${countLabel(correctionMechanisms.length)} visible with Correction.`,
    );
    await expect(appealPaths).toBeVisible();
    await expect(decisionLog).toBeHidden();
    await expect(progressiveConsent).toBeHidden();

    await page
      .getByLabel("Search mechanisms by name or keyword")
      .fill("appeal");
    await expect(filterStatus).toContainText(
      `${countLabel(correctionAppealMechanisms.length)} visible with Correction and search for "appeal".`,
    );
    await expect(appealPaths).toBeVisible();
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

  test("opens the signals panel at a field note's hash", async ({ page }) => {
    await page.goto("/field-notes#price-of-a-decision");
    const signalsTab = page.getByRole("tab", { name: "Signals" });
    const signalPanel = page.locator(
      '[data-field-notes-panel][data-format="signal"]',
    );

    await expect(signalsTab).toHaveAttribute("aria-selected", "true");
    await expect(signalPanel).toBeVisible();
    await expect(page.locator("#price-of-a-decision")).toBeVisible();
  });
});
