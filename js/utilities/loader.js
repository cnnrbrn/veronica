/**
 * Displays a fullscreen loading spinner.
 *
 * - Avoids adding multiple spinners if one already exists
 * - Appends a spinner overlay to the body
 *
 * @function showLoadingIndicator
 * @returns {void}
 */

export function showLoadingIndicator() {
  
    // Check if it already exists to avoid multiple
    if (document.getElementById("loading-indicator")) return;
  
    const loader = document.createElement("div");
    loader.id = "loading-indicator";
    loader.innerHTML = `
      <div class="spinner-overlay">
        <div class="spinner"></div>
      </div>
    `;
    document.body.appendChild(loader);
  }

  /**
 * Hides and removes the loading spinner from the DOM.
 *
 * @function hideLoadingIndicator
 * @returns {void}
 */
  
  export function hideLoadingIndicator() {
  
    const loader = document.getElementById("loading-indicator");
    if (loader) {
      document.body.removeChild(loader);
    }
  }
  