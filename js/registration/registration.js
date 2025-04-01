/* global bootstrap */
//registration
import { registerUser } from "../auth/auth.js";
import { showMessage } from "../messages/messages.js"; //  Importerer meldingsfunksjonen, slette?

document
  .querySelector("#registration-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#register-name").value;
    const email = document.querySelector("#register-email").value;
    const password = document.querySelector("#register-password").value;

    const userData = { name, email, password };

    try {
      console.log("Submit button clicked. Trying to register user...");
      await registerUser(userData);
      console.log(
        "Registration complete. The user is logged in and redirected to the home page.",
      );

      //Bruker meldingsfunksjonen fra `messages.js`
      showMessage(
        "#register-error",
        " Registration successful! You can now log in.",
        "success",
      );

      //  LUKKER MODALEN AUTOMATISK
      setTimeout(() => {
        const registerModal = bootstrap.Modal.getInstance(
          document.getElementById("registerModal"),
        ); //slette?
        registerModal.hide(); //slette?
      }, 2000); // Lukker etter 2 sekunder//slette?
    } catch (error) {
      showMessage(
        "#register-error",
        " Registration failed. Please check your inputs.",
        "danger",
      );

      console.error("Registration failed:", error);
    }
  });
