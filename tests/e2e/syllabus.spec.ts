import { expect, type Locator, test } from "@playwright/test";

const MODULE_ID = "orientation";

const assertCertificateLinks = async (root: Locator) => {
  const certificateItem = root.locator("li").filter({ hasText: "Orientation" });
  await expect(certificateItem).toBeVisible();
  await expect(
    certificateItem.getByRole("link", { name: "Library primer", exact: true }),
  ).toBeVisible();
  await expect(
    certificateItem.getByRole("link", { name: "Burden Modeler", exact: true }),
  ).toBeVisible();
};

test.describe("Syllabus module completion", () => {
  test("tracks module completion, sharing, and hydration", async ({ browser, page }) => {
    await page.addInitScript(() => {
      // @ts-expect-error navigator is writable in the browser context.
      navigator.clipboard = {
        writeText: async (text: string) => {
          // @ts-expect-error window is available in the browser context.
          window.__copiedText = text;
        },
      };
    });

    await page.goto("/syllabus");
    await expect(page.locator("[data-syllabus]")).toBeVisible();

    const module = page.locator(`[data-module="${MODULE_ID}"]`);
    const readingCheckbox = module.locator("[data-reading]");
    const correctQuizOption = module.locator('[data-quiz-option][data-correct="true"]');
    const completionButton = module.locator("[data-complete]");
    const status = module.locator("[data-status]");

    await expect(completionButton).toBeDisabled();

    await readingCheckbox.check();
    await correctQuizOption.check();

    await expect(completionButton).toBeEnabled();
    await expect(status).toContainText("Ready to mark complete");

    await completionButton.click();
    await expect(completionButton).toHaveText("Completed");
    await expect(status).toContainText("Module finished");

    const certificateList = page.locator("[data-certificate-list]");
    const certificateEmpty = page.locator("[data-certificate-empty]");
    await expect(certificateEmpty).toBeHidden();
    await assertCertificateLinks(certificateList);

    const shareInput = page.locator("[data-share-link]");
    const shareStatus = page.locator("[data-share-status]");
    const shareButton = page.locator("[data-share]");

    await expect(shareInput).toHaveValue(/completed=orientation/);

    await shareButton.click();
    await expect(shareStatus).toHaveText("Copied the shareable link to your clipboard.");

    const shareableLink = await shareInput.inputValue();
    expect(shareableLink).toContain(`completed=${MODULE_ID}`);
    const copiedLink = await page.evaluate(() => (window as any).__copiedText);
    expect(copiedLink).toBe(shareableLink);

    const sharedContext = await browser.newContext();
    const sharedPage = await sharedContext.newPage();
    await sharedPage.goto(shareableLink);
    await sharedPage.waitForSelector("[data-syllabus]");

    const sharedModule = sharedPage.locator(`[data-module="${MODULE_ID}"]`);
    await expect(sharedModule.locator("[data-reading]")).toBeChecked();
    await expect(sharedModule.locator("[data-quiz-option]:checked")).toHaveCount(0);
    await expect(sharedModule.locator("[data-complete]")).toHaveText("Completed");
    await expect(sharedModule.locator("[data-status]")).toContainText("Module finished");

    const sharedCertificateList = sharedPage.locator("[data-certificate-list]");
    await expect(sharedPage.locator("[data-certificate-empty]")).toBeHidden();
    await assertCertificateLinks(sharedCertificateList);
    await expect(sharedPage.locator("[data-share-link]")).toHaveValue(/completed=orientation/);

    await sharedContext.close();
  });
});
