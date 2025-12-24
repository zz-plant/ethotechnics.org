import { expect, test } from "@playwright/test";

const HERO_HEADING =
  "Technology should serve people — not the other way around.";

test.describe("Homepage smoke", () => {
  test("shows the primary hero content", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: HERO_HEADING }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Get updates" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore focus areas" }),
    ).toBeVisible();
  });
});

test("serves an XML RSS feed", async ({ request }) => {
  const rss = await request.get("/rss.xml");

  expect(rss.ok()).toBeTruthy();
  expect(rss.headers()["content-type"]).toContain("xml");

  const body = await rss.text();
  expect(body).toContain("<rss");
});

test.describe("Navigation", () => {
  test("opens on mobile and navigates to library", async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 900 });
    await page.goto("/");

    const navContent = page.locator(".nav__content");
    const html = page.locator("html");
    await expect(navContent).not.toHaveClass(/is-open/);
    await expect(html).not.toHaveClass(/nav-locked/);

    await page.getByRole("button", { name: /open navigation/i }).click();
    await expect(navContent).toHaveClass(/is-open/);
    await expect(html).toHaveClass(/nav-locked/);

    await page.getByRole("link", { name: "Library" }).click();
    await page.waitForURL(/\/library/);

    await expect(
      page.getByRole("heading", { level: 1, name: "Library" }),
    ).toBeVisible();
    await expect(page.locator(".nav__content")).not.toHaveClass(/is-open/);
    await expect(html).not.toHaveClass(/nav-locked/);
  });
});
