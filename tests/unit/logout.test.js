import { describe, it, vi, expect, beforeEach } from "vitest";
import { logoutUser } from "../../js/logout/logout.js";
import { clearLocalStorage } from "../../js/utilities/localStorage.js";
import { showMessage } from "../../js/messages/messages.js";

// Mock dependencies
vi.mock("../../js/utilities/localStorage.js", () => ({
  clearLocalStorage: vi.fn(),
}));

vi.mock("../../js/messages/messages.js", () => ({
  showMessage: vi.fn(),
}));

describe("logoutUser", () => {
  beforeEach(() => {
    // Fake DOM
    document.body.innerHTML = `
      <div id="logout-message" class="alert d-none text-center"></div>
      <div id="logoutModal"></div>
    `;

    // Simulate bootstrap
    global.bootstrap = {
      Modal: {
        getInstance: () => ({
          hide: vi.fn(),
        }),
      },
    };

    // Simulate Playwright to avoid redirect
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Playwright",
      writable: true,
    });
  });

  it("should clear localStorage and show a success message", () => {
    logoutUser();

    expect(clearLocalStorage).toHaveBeenCalled();
    expect(showMessage).toHaveBeenCalledWith(
      "#logout-message",
      "You have successfully logged out.",
      "success"
    );
  });
});


