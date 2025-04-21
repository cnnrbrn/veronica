import { test, expect } from "@playwright/test";

const validName = "Test User";
const validEmail = `test${Date.now()}@stud.noroff.no`;
const validPassword = "testpassword";

// Helper function to turn off HTML5 validation so that JavaScript can handle the errors
async function disableHTML5Validation(page) {
  await page.evaluate(() => {
    document.querySelector("#registration-form").setAttribute("novalidate", "true");
  });
}

test.describe("Registration", () => {
  test("User can register successfully", async ({ page }) => {
    await page.goto("/");
    await page.click("button[data-bs-target='#registerModal']");
    await page.waitForSelector("#register-name", { state: "visible" });

    await page.fill("#register-name", validName);
    await page.fill("#register-email", validEmail);
    await page.fill("#register-password", validPassword);
    await page.click("#registration-form button[type='submit']");

    // We expect a message to appear
    await expect(page.locator("#register-error")).toHaveText(/.+/, { timeout: 7000 });
  });

  test("Shows error on invalid email", async ({ page }) => {
    await page.goto("/");
    await page.click("button[data-bs-target='#registerModal']");
    await page.waitForSelector("#register-name", { state: "visible" });

    await disableHTML5Validation(page);

    await page.fill("#register-name", validName);
    await page.fill("#register-email", "invalidemail"); 
    await page.fill("#register-password", validPassword);
    await page.click("#registration-form button[type='submit']");

    await expect(page.locator("#register-error")).toHaveText(/.+/, { timeout: 7000 });
  });

  test("Shows error on too short password", async ({ page }) => {
    await page.goto("/");
    await page.click("button[data-bs-target='#registerModal']");
    await page.waitForSelector("#register-name", { state: "visible" });

    await disableHTML5Validation(page);

    await page.fill("#register-name", validName);
    await page.fill("#register-email", `short${Date.now()}@stud.noroff.no`);
    await page.fill("#register-password", "short"); // for kort
    await page.click("#registration-form button[type='submit']");

    await expect(page.locator("#register-error")).toHaveText(/.+/, { timeout: 7000 });
  });

  test("Shows error on missing fields", async ({ page }) => {
    await page.goto("/");
    await page.click("button[data-bs-target='#registerModal']");
    await page.waitForSelector("#register-name", { state: "visible" });

    await disableHTML5Validation(page);

    await page.fill("#register-name", "");
    await page.fill("#register-email", "");
    await page.fill("#register-password", "");
    await page.click("#registration-form button[type='submit']");

    await expect(page.locator("#register-error")).toHaveText(/.+/, { timeout: 7000 });
  });
});
