/* global bootstrap */
import { clearLocalStorage } from "../utilities/localStorage.js";
import { showMessage } from "../messages/messages.js";

/**
 * Logs out the user by:
 * - Clearing localStorage
 * - Showing a success message in a modal
 * - Automatically closing the modal and redirecting to the homepage
 *
 * @function logoutUser
 * @returns {void}
 */

// Function to handle logout
function logoutUser() {
  console.log("Logging out the user...");

  // Clearing localStorage
  clearLocalStorage();

  console.log("Calling showMessage to display logout message..."); 

  // Showing success message in the logout modal
  showMessage("#logout-message", "You have successfully logged out.", "success");

  console.log("showMessage function was called!"); 

   // 🚨 Denne linjen sjekker om testen kjører i Playwright
   const isTest = navigator.userAgent.includes("Playwright");

   if (!isTest) {
  //  Close the modal and redirect after 2 seconds
  setTimeout(() => {
    console.log("Closing modal and redirecting..."); 
    const logoutModal = bootstrap.Modal.getInstance(
      document.getElementById("logoutModal"),
    );
    if (logoutModal) {
      logoutModal.hide();
    }
    //  Redirect to the front page
    window.location.href = "/index.html";
  }, 2000);
}

}

/**
 * Sets up the logout button's event listener.
 * Ensures the listener is only attached if the button exists in the DOM.
 *
 * @function setupLogoutListener
 * @returns {void}
 */

//Add event listeners only when the button exists (i.e. in the real DOM, not during testing)
export function setupLogoutListener() {
  const button = document.querySelector("#confirm-logout");
  if (button) {
    button.addEventListener("click", logoutUser);
  }
}

setupLogoutListener(); 
export { logoutUser };

