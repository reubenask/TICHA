import { expect, test } from "@playwright/test";

test("mobile layout does not create horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /ticha/i })).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    html: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  }));

  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.html).toBeLessThanOrEqual(dimensions.viewport);
});
