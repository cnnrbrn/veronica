import { test, expect } from "@playwright/test";

test.describe("Logout", () => {
  test("User can log out and see success message", async ({ page }) => {
    // 👉 Gå til nettsiden
    await page.goto("http://127.0.0.1:5500/index.html");

    // 👉 Åpne logout-modalen (hvis den finnes via knapp)
    await page.click('button[data-bs-target="#logoutModal"]');

    // 👉 Klikk på logout-knappen i modal
    await page.click("#confirm-logout");

    // 👉 Vent til meldingen vises
    const logoutMessages = await page.locator("#logout-message").all();

    // 👉 Finn meldingen som faktisk inneholder teksten
    let foundSuccessMessage = false;
    for (const message of logoutMessages) {
      const text = await message.textContent();
      if (text.includes("successfully logged out")) {
        await expect(message).toBeVisible();
        foundSuccessMessage = true;
      }
    }

    // ✅ Sørg for at vi fant riktig melding
    expect(foundSuccessMessage).toBe(true);

    // ✅ Bekreft at localStorage er tom for token
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("accessToken"),
    );
    expect(accessToken).toBeNull();
  });
});
