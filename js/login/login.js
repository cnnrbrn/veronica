/* global bootstrap */
import { loginUser } from "../auth/auth.js";
import { showMessage } from "../messages/messages.js"; 

/**
 * Handles the login form submission.
 *
 * - Prevents default form behavior
 * - Extracts email and password
 * - Calls the `loginUser` function to attempt login
 * - Shows success or error messages
 * - Closes the modal on success after a short delay
 *
 * @async
 * @function
 * @param {Event} event - The form submission event
 * @returns {Promise<void>}
 */

document.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;

    try {
      await loginUser(email, password);
   
      // Use `showMessage` to display the success message
      showMessage("#login-error", "Login successful! Redirecting...", "success");

      // CLOSE MODAL AUTOMATICALLY AFTER 2 SECONDS
      setTimeout(() => {
        const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
        if (loginModal) {
          loginModal.hide();
        }
      }, 2000);
    } catch (error) {

       // Show error message
      showMessage("#login-error", "Login failed. Please check your credentials.", "danger");
    }
  });
