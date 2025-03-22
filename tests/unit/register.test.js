import { describe, it, expect, vi } from "vitest";
import { registerUser } from "../../js/auth/auth.js";

// Mock fetch API
global.fetch = vi.fn();

describe("registerUser", () => {
  it("should register a user successfully", async () => {
    // ✅ Simulert API-respons (mock)
    const mockResponse = {
      ok: true,
      json: async () => ({
        data: {
          name: "TestUser",
          email: "test@stud.noroff.no",
        },
      }),
    };

    fetch.mockResolvedValueOnce(mockResponse); // 🔄 Simulerer API-kallet

    const userData = {
      name: "TestUser",
      email: "test@stud.noroff.no",
      password: "SecurePassword123",
    };

    await registerUser(userData);

    // ✅ Sjekker at `fetch()` ble kalt riktig
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("auth/register"),
      expect.any(Object),
    );
  });

  it("should throw an error if registration fails", async () => {
    // ❌ Simulerer en API-feil
    const mockErrorResponse = {
      ok: false,
      status: 400,
      json: async () => ({
        errors: ["Email already exists"],
      }),
    };

    fetch.mockResolvedValueOnce(mockErrorResponse);

    const userData = {
      name: "TestUser",
      email: "existing@stud.noroff.no",
      password: "SecurePassword123",
    };

    // ✅ Sjekker at feilen håndteres riktig
    await expect(registerUser(userData)).rejects.toThrow(
      "Registration failed with status 400",
    );
  });
});
