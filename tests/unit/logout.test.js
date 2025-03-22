import { describe, it, vi, expect, beforeEach } from "vitest";
import { logoutUser } from "../../js/logout/logout.js";

// Mock showMessage
vi.mock("../../js/messages/messages.js", () => ({
  showMessage: vi.fn(),
}));

// Mock clearLocalStorage
vi.mock("../../js/utilities/localStorage.js", () => ({
  clearLocalStorage: vi.fn(),
}));

describe("logoutUser", () => {
  beforeEach(() => {
    // 👉 Fake DOM-element for meldingen
    document.body.innerHTML = `<div id="logout-message" class="alert d-none text-center"></div>`;
  });

  it("should clear localStorage and show a success message", () => {
    const { clearLocalStorage } = require("../../js/utilities/localStorage.js");
    const { showMessage } = require("../../js/messages/messages.js");

    logoutUser();

    expect(clearLocalStorage).toHaveBeenCalled();
    expect(showMessage).toHaveBeenCalledWith(
      "#logout-message",
      " You have successfully logged out.",
      "success",
    );
  });
});
