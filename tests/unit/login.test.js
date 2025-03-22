import { describe, it, expect, vi } from "vitest";
import { loginUser } from "../../js/auth/auth.js";

// Mock fetch API
global.fetch = vi.fn();

describe("loginUser", () => {
  it("should log in a user and store token", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        data: {
          accessToken: "fake-token",
          name: "TestUser",
        },
      }),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    const email = "test@stud.noroff.no";
    const password = "password123";

    await loginUser(email, password);

    expect(localStorage.getItem("accessToken")).toBe("fake-token");
    expect(localStorage.getItem("userEmail")).toBe(email);
    expect(localStorage.getItem("username")).toBe("TestUser");
  });

  it("should throw an error if login fails", async () => {
    const mockErrorResponse = {
      ok: false,
      status: 401,
      json: async () => ({
        errors: ["Invalid credentials"],
      }),
    };

    fetch.mockResolvedValueOnce(mockErrorResponse);

    const email = "wrong@stud.noroff.no";
    const password = "wrongpassword";

    await expect(loginUser(email, password)).rejects.toThrow(
      "Login failed with status 401",
    );
  });
});
