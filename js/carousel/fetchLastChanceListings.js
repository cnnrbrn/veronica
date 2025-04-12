import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { API_BASE_URL, API_KEY, PROFILE_ENDPOINT } from "../config/constants.js";
import { renderCarousel } from "./renderCarousel.js";

export async function fetchLastChanceListings() {
  const username = retrieveFromLocalStorage("username");
  const accessToken = retrieveFromLocalStorage("accessToken");

  if (!username || !accessToken) {
    console.warn("User not logged in. Not showing carousel.");
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

    const listingsWithImages = data.filter(listing => listing.media?.length > 0);

    renderCarousel(listingsWithImages.slice(0, 5)); 
  } catch (error) {
    console.error("Error retrieving your 'Last Chance' auctions:", error);
  }
}

fetchLastChanceListings(); 
