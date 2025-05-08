/* global bootstrap */
//registration
import { registerUser } from "../auth/auth.js";
import { showMessage } from "../messages/messages.js"; 

/**
 * Handles the registration form submission.
 *
 * - Prevents default form behavior
 * - Collects name, email, and password from the form
 * - Calls `registerUser()` to attempt registration
 * - Displays success or error messages
 * - Closes the registration modal on success
 *
 * @async
 * @function
 */

document
  .querySelector("#registration-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#register-name").value;
    const email = document.querySelector("#register-email").value;
    const password = document.querySelector("#register-password").value;

    const userData = { name, email, password };

    try {
      
      await registerUser(userData);
  
      // Using the message function from `messages.js`
      showMessage("#register-error", "Registration successful! You can now log in.", "success");

      //  Close modal automatically
      setTimeout(() => {
        const registerModal = bootstrap.Modal.getInstance(
          document.getElementById("registerModal"),
        ); 
        registerModal.hide(); 
      }, 2000); 
    } catch (error) {
      showMessage("#register-error", "Registration failed. Please check your inputs.", "danger");

    }
  });
