/* global bootstrap */
//registration
import { registerUser } from "../auth/auth.js";
import { showMessage } from "../messages/messages.js"; 

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

      // Using the message function from `messages.js`
      showMessage(
        "#register-error",
        " Registration successful! You can now log in.",
        "success",
      );

      //  Close modal automatically
      setTimeout(() => {
        const registerModal = bootstrap.Modal.getInstance(
          document.getElementById("registerModal"),
        ); 
        registerModal.hide(); 
      }, 2000); 
    } catch (error) {
      showMessage(
        "#register-error",
        " Registration failed. Please check your inputs.",
        "danger",
      );

      console.error("Registration failed:", error);
    }
  });
