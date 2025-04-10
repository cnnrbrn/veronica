document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const submitButton = document.querySelector("button[type='submit']");
    const errorMessages = document.querySelectorAll(".error-message");
  
    submitButton.addEventListener("click", function (event) {
      event.preventDefault();
      errorMessages.forEach((msg) => (msg.textContent = ""));
  
      let hasError = false;
  
      if (nameInput.value.trim().length < 2) {
        showError(nameInput, "Name must be at least 2 characters");
        hasError = true;
      }
  
      if (lastNameInput.value.trim().length < 2) {
        showError(lastNameInput, "Last name must be at least 2 characters");
        hasError = true;
      }
  
      if (!isValidEmail(emailInput.value)) {
        showError(emailInput, "Invalid email format");
        hasError = true;
      }
  
      if (messageInput.value.trim().length < 10) {
        showError(messageInput, "Message must be at least 10 characters");
        hasError = true;
      }
  
      if (!hasError) {
        alert("Message sent successfully!");
        document.getElementById("contactForm").reset();
      }
    });
  
    function showError(input, message) {
      const msg = input.parentElement.querySelector(".error-message");
      if (msg) msg.textContent = message;
    }
  
    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
  });
  
  