/* global bootstrap */
// Handling user interaction for the login page
import { loginUser } from "../auth/auth.js";
import { showMessage } from "../messages/messages.js"; // ✅ Importerer meldingsfunksjonen

document
  .querySelector("#login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Submit button clicked. Trying to log in...");

    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;

    try {
      console.log("Trying to log in with:", email);
      await loginUser(email, password);
      console.log("The user is logged in!");

      // ✅ VISER SUKSESSMELDING
      //const loginError = document.querySelector('#login-error');
      //loginError.textContent = ' Login successful! Redirecting...';
      //loginError.classList.remove('text-danger');
      //loginError.classList.add('text-success');

      // ✅ Bruk `showMessage` for å vise suksessmeldingen
      showMessage(
        "#login-error",
        " Login successful! Redirecting...",
        "success",
      );

      // ✅ LUKKER MODALEN AUTOMATISK ETTER 2 SEKUNDER
      setTimeout(() => {
        const loginModal = bootstrap.Modal.getInstance(
          document.getElementById("loginModal"),
        );
        if (loginModal) {
          loginModal.hide();
        }
      }, 2000);
    } catch (error) {
      console.error("Login failed:", error);
      document.querySelector("#login-error").textContent =
        "Login failed. Please check your credentials.";
      showMessage(
        "#login-error",
        " Login failed. Please check your credentials.",
        "danger",
      );
    }
  });
