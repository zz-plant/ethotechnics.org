import { expect, test } from "@playwright/test";

test.describe("Component Visual Regression", () => {
  test("renders component preview page correctly", async ({ page }) => {
    // Visit the component preview page
    const response = await page.goto("/_components_preview");
    expect(response?.ok()).toBeTruthy();

    // Visual checks
    await expect(page.getByRole("heading", { name: "Component Preview" })).toBeVisible();
    
    // Check PageIntro
    await expect(page.getByRole("heading", { name: "PageIntro" })).toBeVisible();
    await expect(page.getByText("Component Visual Testing")).toBeVisible();
    
    // Check CardItems
    await expect(page.getByRole("heading", { name: "CardItem" })).toBeVisible();
    await expect(page.getByText("Default Card")).toBeVisible();
    await expect(page.getByText("Card with Tags")).toBeVisible();
    await expect(page.getByText("Glossary Card")).toBeVisible();
  });
});
