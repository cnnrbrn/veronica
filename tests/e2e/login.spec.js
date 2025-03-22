import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test("User can log in successfully", async ({ page }) => {
    // ✅ 1️⃣ Mock API for vellykket innlogging
    await page.route("*/**/auth/login", (route) =>
      route.fulfill({
        status: 200,
        json: { data: { accessToken: "fake-token", name: "TestUser" } },
      }),
    );

    // ✅ 2️⃣ Gå til nettsiden
    await page.goto("http://127.0.0.1:5500/index.html");

    // ✅ 3️⃣ Åpne login-modal
    await page.click('button[data-bs-target="#loginModal"]');
    await expect(page.locator("#loginModal")).toBeVisible();

    // ✅ 4️⃣ Fyll ut login-skjemaet
    await page.fill("#login-email", "test@stud.noroff.no");
    await page.fill("#login-password", "password123");

    // ✅ 5️⃣ Klikk på login-knappen
    await page.click('#loginModal button[type="submit"]');

    // ✅ 6️⃣ Vent på respons
    await page.waitForTimeout(1000);

    // ✅ 7️⃣ Sjekk at suksessmeldingen vises
    await expect(page.locator("#login-error")).toHaveText(/Login successful/i);
  });

  test("User sees error message when login fails", async ({ page }) => {
    // ❌ 1️⃣ Mock API for feilet innlogging
    await page.route("*/**/auth/login", (route) =>
      route.fulfill({
        status: 401,
        json: { errors: ["Invalid credentials"] },
      }),
    );

    // ❌ 2️⃣ Gå til nettsiden
    await page.goto("http://127.0.0.1:5500/index.html");

    // ❌ 3️⃣ Åpne login-modal
    await page.click('button[data-bs-target="#loginModal"]');
    await expect(page.locator("#loginModal")).toBeVisible();

    // ❌ 4️⃣ Fyll ut login-skjemaet med feil passord
    await page.fill("#login-email", "wrong@stud.noroff.no");
    await page.fill("#login-password", "wrongpassword");

    // ❌ 5️⃣ Klikk på login-knappen
    await page.click('#loginModal button[type="submit"]');

    // ❌ 6️⃣ Vent på respons
    await page.waitForTimeout(1000);

    // ❌ 7️⃣ Sjekk at feilmeldingen vises
    await expect(page.locator("#login-error")).toContainText("Login failed");
  });
});
