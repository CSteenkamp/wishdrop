import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/WishDrop/);
  });

  test('has "Create Registry" and "Join Registry" links', async ({ page }) => {
    await page.goto("/");
    const createLink = page.getByRole("link", { name: /Create Registry/i });
    const joinLink = page.getByRole("link", { name: /Join Registry/i });
    await expect(createLink).toBeVisible();
    await expect(joinLink).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Create Registry/i }).first().click();
    await expect(page).toHaveURL(/\/create/);
  });
});
