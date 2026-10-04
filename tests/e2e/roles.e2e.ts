import { expect, test } from "@playwright/test";

import { roles, rolePermalink } from "../../src/content/roles";

/**
 * Asserts content, not status codes.
 *
 * The prerendered routes on this site return 200 while serving a 15-byte
 * placeholder (docs/planning/prerender-finding-2026-09.md), which is precisely
 * the failure a status-code assertion cannot see. These cases check that the
 * page contains its own material.
 */

test.describe("Role pages", () => {
  for (const role of roles) {
    test(`${role.id} renders its own heading and material`, async ({
      page,
    }) => {
      const response = await page.goto(rolePermalink(role.id));
      expect(response?.status()).toBe(200);

      await expect(
        page.getByRole("heading", { level: 1, name: role.label, exact: true }),
      ).toBeVisible();

      // Whatever was written for this role has to actually appear, and the
      // registry has to be what drove it. Counting rendered items rather than
      // matching prose is deliberate: the glossary highlighter rewraps terms
      // like "contestability" at runtime, so a full-sentence text match fails
      // on a page that rendered perfectly.
      if (role.orientation?.length) {
        await expect(page.locator("#first-moves")).toBeVisible();
        await expect(page.locator("#first-moves li.card")).toHaveCount(
          role.orientation.length,
        );
      } else {
        await expect(page.locator("#first-moves")).toHaveCount(0);
      }

      if (role.guide) {
        await expect(page.locator("#focus")).toBeVisible();
        await expect(page.locator("#focus li")).toHaveCount(
          role.guide.focusAreas.length,
        );
        await expect(page.locator("#reads")).toBeVisible();
      } else {
        await expect(page.locator("#focus")).toHaveCount(0);
        await expect(page.locator("#reads")).toHaveCount(0);
      }

      if (role.adoptionChecklist?.length) {
        await expect(page.locator("#adopt")).toBeVisible();
        await expect(page.locator("#adopt li")).toHaveCount(
          role.adoptionChecklist.length,
        );
      } else {
        await expect(page.locator("#adopt")).toHaveCount(0);
      }
    });
  }

  test("start offers every role and links to its page", async ({ page }) => {
    await page.goto("/start");
    for (const role of roles) {
      await expect(
        page.locator(`a[href="${rolePermalink(role.id)}"]`).first(),
      ).toBeVisible();
    }
  });

  test("the vocabularies that were merged still land somewhere", async ({
    page,
  }) => {
    for (const role of roles) {
      for (const formerPath of role.formerPaths) {
        const response = await page.goto(formerPath);
        expect(response?.status(), `${formerPath} should resolve`).toBe(200);
        await expect(
          page.getByRole("heading", {
            level: 1,
            name: role.label,
            exact: true,
          }),
        ).toBeVisible();
      }
    }
  });
});
