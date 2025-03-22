import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test("User sees error message when login fails", async ({ page }) => {
    // 1️⃣ Mock API for feil innlogging
    await page.route("*/**/auth/login", (route) =>
      route.fulfill({
        status: 401, // 401 = Unauthorized (feil innlogging)
        json: { errors: ["Invalid credentials"] },
      }),
    );

    // 2️⃣ Gå til nettsiden
    await page.goto("http://127.0.0.1:5500/index.html");

    // 3️⃣ Åpne login-modal
    await page.click('button[data-bs-target="#loginModal"]');
    await expect(page.locator("#loginModal")).toBeVisible();

    // 4️⃣ Fyll ut feil login-data
    await page.fill("#login-email", "wrong@stud.noroff.no");
    await page.fill("#login-password", "wrongpassword");

    // 5️⃣ Klikk på "Login"-knappen
    await page.click('#loginModal button[type="submit"]');

    // 6️⃣ **Vent på at feilmeldingen vises**
    await page.waitForTimeout(2000); // ✅ Gir UI tid til å oppdatere

    // 7️⃣ **Sjekk at feilmeldingen faktisk vises**
    await expect(page.locator("#login-error")).toContainText("Login failed");
  });
});
