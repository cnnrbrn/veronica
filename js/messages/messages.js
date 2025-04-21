/**
 * Displays a Bootstrap-style alert message in the specified container.
 *
 * - Accepts a selector to target a specific HTML element
 * - Injects a Bootstrap alert with the desired message and style
 * - Does nothing if the container is not found
 *
 * @function showMessage
 * @param {string} selector - CSS selector for the container where the message should appear
 * @param {string} message - The message text to display
 * @param {string} [type="info"] - Bootstrap alert type (e.g., "success", "danger", "warning", "info")
 *
 * @example
 * showMessage("#login-error", "Login successful!", "success");
 */

export function showMessage(selector, message, type = "info") {
  const container = document.querySelector(selector);
  if (!container) return;

    // 🔥 Fjern "d-none" slik at meldingen faktisk vises
    container.classList.remove("d-none");

  container.innerHTML = `
      <div class="alert alert-${type} mt-2" role="alert">
        ${message}
      </div>
    `;
}
