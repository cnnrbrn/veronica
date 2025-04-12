import { fetchUserProfile } from "./profile/profile.js";
import { fetchLastChanceListings } from "./carousel/fetchLastChanceListings.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("app.js has loaded!"); // Checking if the script is running

  const username = localStorage.getItem("username");
  if (username) {
    console.log(`Fetching profile for: ${username}`); 
    fetchUserProfile(username);
  } else {
    console.warn("No user logged in.");
  }
    //  Run the carousel regardless of whether the user is logged in or not
    fetchLastChanceListings();
});
