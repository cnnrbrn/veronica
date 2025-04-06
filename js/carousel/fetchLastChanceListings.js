import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { API_BASE_URL, API_KEY, PROFILE_ENDPOINT } from "../config/constants.js";
import { renderCarousel } from "./renderCarousel.js";

export async function fetchLastChanceListings() {
  const username = retrieveFromLocalStorage("username");
  const accessToken = retrieveFromLocalStorage("accessToken");

  if (!username || !accessToken) {
    console.warn("Bruker ikke logget inn. Viser ikke karusell.");
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

    renderCarousel(listingsWithImages.slice(0, 5)); // Vis maks 5
  } catch (error) {
    console.error("Feil ved henting av dine 'Last Chance'-auksjoner:", error);
  }
}

fetchLastChanceListings(); // Kjør automatisk
