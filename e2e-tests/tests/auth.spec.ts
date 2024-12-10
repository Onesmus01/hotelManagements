import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:517";

test('should not allow user to sign in with incorrect credentials', async ({ page }) => {
  await page.goto(UI_URL);

  // Navigate to sign in page
  await page.getByRole("link", { name: "sign in" }).click();
  
  // Fill out login form with invalid credentials
  await page.locator("[name=email]").fill("invalid@example.com");
  await page.locator("[name=password]").fill("wrongpassword");
  await page.getByRole("button", { name: "login" }).click();

  // Check for error message
  await expect(page.locator('text=Invalid credentials')).toBeVisible(); // Adjust based on your backend's response
});
