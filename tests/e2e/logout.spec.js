import { test, expect } from "@playwright/test";

test.describe("Logout", () => {
  test("User can log out and see success message", async ({ page }) => {
    // Go to the website
    await page.goto("http://127.0.0.1:5500/index.html");

    // Open the logout modal (if available via button)
    await page.click('button[data-bs-target="#logoutModal"]');

    // Click the logout button in the modal
    await page.click("#confirm-logout");

    // Wait until the message appears
    const logoutMessages = await page.locator("#logout-message").all();

    // Find the message that actually contains the text
    let foundSuccessMessage = false;
    for (const message of logoutMessages) {
      const text = await message.textContent();
      if (text.includes("successfully logged out")) {
        await expect(message).toBeVisible();
        foundSuccessMessage = true;
      }
    }

    // Make sure we found the right message
    expect(foundSuccessMessage).toBe(true);

    // Verify that localStorage is empty of tokens
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("accessToken"),
    );
    expect(accessToken).toBeNull();
  });
});
