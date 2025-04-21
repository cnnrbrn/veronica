import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config(); // Loads environment variables from .env

test.describe("Login", () => {
  test("User can log in and token is saved", async ({ page }) => {
    await page.goto("/");

    // Open login modal
    await page.click("button[data-bs-target='#loginModal']");

    // Fill out the login form
    await page.fill("#login-email", process.env.TEST_USER_EMAIL);
    await page.fill("#login-password", process.env.TEST_USER_PASSWORD);
    await page.click("#login-form button[type='submit']");

    // Check that the token is stored in localStorage
    await page.waitForFunction(() => localStorage.getItem("accessToken") !== null);
    const token = await page.evaluate(() => localStorage.getItem("accessToken"));
    console.log("Access token:", token);
    expect(token).not.toBeNull();

  // Check that "Credits" is displayed in the navbar (or other indicator of login)
    await expect(page.locator("#credits")).toContainText("Credits");
  });

  test("User sees error message when login fails", async ({ page }) => {
    await page.goto("/");
    await page.click("button[data-bs-target='#loginModal']");
    await page.fill("#login-email", "feil@stud.noroff.no");
    await page.fill("#login-password", "feilpassord");
    await page.click("#login-form button[type='submit']");

    // Check that an error message is displayed
    await expect(page.locator("#login-error")).toContainText(/Login failed/i);
  });
});
