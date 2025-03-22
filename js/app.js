import { fetchUserProfile } from "./profile/profile.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js has loaded!"); // Sjekker om scriptet kjører

  const username = localStorage.getItem("username");
  if (username) {
    console.log(`🔍 Fetching profile for: ${username}`); // Sjekker om username hentes
    fetchUserProfile(username);
  } else {
    console.warn("⚠️ No user logged in.");
  }
});
