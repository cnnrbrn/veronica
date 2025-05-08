import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { API_BASE_URL, API_KEY, PROFILE_ENDPOINT } from "../config/constants.js";
import { renderCarousel } from "./renderCarousel.js";

/**
 * Fetches the user's auction listings sorted by end time (ascending),
 * filters out listings without images, and sends the first 5 to the carousel renderer.
 *
 * Requires the user to be logged in (username and accessToken in localStorage).
 *
 * @async
 * @function fetchLastChanceListings
 * @returns {Promise<void>}
 *
 * @example
 * fetchLastChanceListings(); // Automatically runs on load
 */

export async function fetchLastChanceListings() {
  const username = retrieveFromLocalStorage("username");
  const accessToken = retrieveFromLocalStorage("accessToken");

  if (!username || !accessToken) {
    //console.warn("User not logged in. Not showing carousel.");
    return;
  }

  try {
    const response = await fetch(
      `${PROFILE_ENDPOINT(username)}/listings?_sort=endsAt&sortOrder=asc&_bids=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    const { data } = await response.json();

    // Filter out listings without images
    const listingsWithImages = data.filter(listing => listing.media?.length > 0);

    // Send top 5 to carousel
    renderCarousel(listingsWithImages.slice(0, 5)); 
  } catch (error) {
    console.error("Error retrieving your 'Last Chance' auctions:", error);
  }
}

// Run immediately on load
fetchLastChanceListings(); 
