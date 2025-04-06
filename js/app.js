import { fetchUserProfile } from "./profile/profile.js";
import { fetchLastChanceListings } from "./carousel/fetchLastChanceListings.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("app.js has loaded!"); // Sjekker om scriptet kjører

  const username = localStorage.getItem("username");
  if (username) {
    console.log(`Fetching profile for: ${username}`); // Sjekker om username hentes
    fetchUserProfile(username);
  } else {
    console.warn("No user logged in.");
  }
    // 🔄 Kjør karusellen uansett om bruker er logget inn eller ikke
    fetchLastChanceListings();
});
