//Logout
//import { clearLocalStorage } from '../utilities/localStorage.js';

/**
 * Logging out the user by deleting localStorage data and redirecting
 */
//function logoutUser() {
//console.log('Logging out the user...');
//clearLocalStorage();
//window.location.href = '/index.html';
//}

// Adding an event listener for the logout button
//document.querySelector('#logout-button').addEventListener('click', logoutUser);

/* global bootstrap */
import { clearLocalStorage } from "../utilities/localStorage.js";
import { showMessage } from "../messages/messages.js";

// Funksjon for å håndtere logout
function logoutUser() {
  console.log("Logging out the user...");

  // Tømmer localStorage
  clearLocalStorage();

  console.log("🟢 Calling showMessage to display logout message..."); //slette?

  //  Viser suksessmelding i logout-modalen
  showMessage(
    "#logout-message",
    " You have successfully logged out.",
    "success",
  );

  console.log("✅ showMessage function was called!"); //slette?

  //  Lukk modalen og omdiriger etter 2 sekunder
  setTimeout(() => {
    console.log("⏳ Closing modal and redirecting..."); //slette?
    const logoutModal = bootstrap.Modal.getInstance(
      document.getElementById("logoutModal"),
    );
    if (logoutModal) {
      logoutModal.hide();
    }
    //  Omdiriger til forsiden
    window.location.href = "/index.html";
  }, 2000);
}

// ** Event listener for confirm logout-knappen i modalen **
//document.querySelector('#confirm-logout').addEventListener('click', logoutUser);

// 👉 Legg til event listener kun når knappen finnes (altså i ekte DOM, ikke under test)
export function setupLogoutListener() {
  const button = document.querySelector("#confirm-logout");
  if (button) {
    button.addEventListener("click", logoutUser);
  }
}

setupLogoutListener(); // kjør som vanlig i appen
