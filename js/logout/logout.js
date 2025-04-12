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

// Function to handle logout
function logoutUser() {
  console.log("Logging out the user...");

  // Clearing localStorage
  clearLocalStorage();

  console.log("Calling showMessage to display logout message..."); 

  //  Showing success message in the logout modal
  showMessage(
    "#logout-message",
    " You have successfully logged out.",
    "success",
  );

  console.log("showMessage function was called!"); 

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

// ** Event listener for confirm logout-knappen i modalen **
//document.querySelector('#confirm-logout').addEventListener('click', logoutUser);

//Add event listeners only when the button exists (i.e. in the real DOM, not during testing)
export function setupLogoutListener() {
  const button = document.querySelector("#confirm-logout");
  if (button) {
    button.addEventListener("click", logoutUser);
  }
}

setupLogoutListener(); 
