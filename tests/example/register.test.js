import { expect, describe, it, beforeEach, vi } from "vitest";
import { register } from "../../js/utils/auth/auth.js";

describe("register", () => {
  beforeEach(() => {
    global.fetch = vi.fn(); // Mock `fetch` før hver test
  });

  it("returns the user data when registration succeeds", async () => {
    const successResponse = {
      id: 1,
      name: "John Smith",
      email: "john@stud.noroff.no",
    };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(successResponse),
    });

    const result = await register({
      name: "John Smith",
      email: "john@stud.noroff.no",
      password: "password123",
    });

    expect(result).toEqual(successResponse);
  });

  it("throws an error when registration fails", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Email already exists" }),
    });

    await expect(
      register({
        name: "John Smith",
        email: "john@stud.noroff.no",
        password: "password123",
      }),
    ).rejects.toThrow("Registration failed");
  });
});
