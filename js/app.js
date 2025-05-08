import { fetchUserProfile } from "./profile/profile.js";
import { fetchLastChanceListings } from "./carousel/fetchLastChanceListings.js";

/**
 * Initializes core app functionality on DOM load.
 *
 * - If a user is logged in (via localStorage), fetches their profile
 * - Always fetches last chance listings for the carousel
 */

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");

  if (username) {
    fetchUserProfile(username);
  } 
  
  //  Run the carousel regardless of whether the user is logged in or not
  fetchLastChanceListings();
  
});
