//function showLogoutMessage() {
//const message = sessionStorage.getItem('logoutMessage');
//if (message) {
//const messageDiv = document.querySelector('#logout-message');
//messageDiv.textContent = message;
//messageDiv.classList.remove('d-none');

// Fjerner meldingen etter 3 sekunder
//setTimeout(() => {
//messageDiv.classList.add('d-none');
//sessionStorage.removeItem('logoutMessage');
//}, 3000);
//}
//}

//document.addEventListener('DOMContentLoaded', showLogoutMessage);

//export function showMessage(elementId, message, type = "success") {
//const element = document.querySelector(elementId);
//element.textContent = message;

//if (type === "success") {
//element.classList.remove("text-danger");
//element.classList.add("text-success");
//} else {
//element.classList.remove("text-success");
//element.classList.add("text-danger");
//}
//}

export function showMessage(elementId, message, type = "success") {
  const element = document.querySelector(elementId);
  if (!element) {
    console.error(`Element ${elementId} not found!`);
    return;
  }

  element.textContent = message;

  if (type === "success") {
    element.classList.remove("text-danger");
    element.classList.add("text-success", "alert", "alert-success");
  } else {
    element.classList.remove("text-success");
    element.classList.add("text-danger", "alert", "alert-danger");
  }
}
