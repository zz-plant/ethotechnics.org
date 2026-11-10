import { expect, test, type Page } from "@playwright/test";

/**
 * Header search against the index `bun run build` writes.
 *
 * For months no build carried a Pagefind index, and the dialog answered every
 * query with its fallback link. The unit tests could not see that: they hand
 * the renderer made-up results. These cases load the real index, so they fail
 * when it is missing, when pages lose the type the result groups are named
 * from, or when an excerpt's highlight reaches the reader as raw markup.
 */

test.describe("Header search", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  const openSearch = async (page: Page) => {
    await page.goto("/method");
    await page.locator("[data-search-trigger]:visible").click();
    const dialog = page.locator("dialog[data-search-dialog][open]");
    await expect(dialog).toBeVisible();
    return dialog;
  };

  test("finds a word in page text and names the result groups", async ({
    page,
  }) => {
    const dialog = await openSearch(page);
    await dialog.locator("[data-search-input]").fill("appeal");

    const groups = dialog.locator(".search-results__group-title");
    await expect(groups.filter({ hasText: "Glossary" })).toBeVisible();
    await expect(groups.filter({ hasText: "Standards" })).toBeVisible();

    const excerpt = dialog.locator(".search-result__excerpt").first();
    await expect(excerpt.locator("mark").first()).toBeVisible();
    await expect(excerpt).not.toContainText("<mark>");
  });

  test("finds a standard by its ID", async ({ page }) => {
    const dialog = await openSearch(page);
    await dialog.locator("[data-search-input]").fill("STD-01");

    await expect(
      dialog.locator(
        '.search-result a[href="/standards/std-01-temporal-rights"]',
      ),
    ).toBeVisible();
  });

  test("says so when no page matches", async ({ page }) => {
    const dialog = await openSearch(page);
    await dialog.locator("[data-search-input]").fill("florbleglorp");

    await expect(dialog.locator(".search-empty")).toContainText(
      "No pages match “florbleglorp”",
    );
  });
});
