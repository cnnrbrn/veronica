import { API_KEY, API_BASE_URL, PROFILE_ENDPOINT } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { showLoadingIndicator, hideLoadingIndicator } from "../utilities/loader.js";

/**
 * Handles fetching, rendering, and updating auction listings on the front page.
 *
 * - Fetches user-specific and general auction listings
 * - Renders listings with images, countdown, highest bid, and buttons
 * - Updates countdown timers every second
 * - Supports "Show more" functionality
 * - Allows other modules (like placeBid.js) to refresh the listing view
 *
 * @module getListings
 */


const container = document.querySelector("#listing-container");
const loadMoreBtn = document.querySelector("#loadMoreBtn");

const username = retrieveFromLocalStorage("username");
const accessToken = retrieveFromLocalStorage("accessToken");

let userListings = [];
let otherListings = [];
let showAll = false;

/**
 * Calculates remaining time between now and the listing end date.
 *
 * @param {string} endsAt - ISO string for when the auction ends.
 * @returns {string} Time remaining in format "Xd Xh Xm Xs" or "Ended".
 */

function formatTimeLeft(endsAt) {
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Fetches the current user's listings from the API.
 * Loads the 9 newest, then fetches other listings.
 *
 * @async
 * @function fetchUserListings
 * @returns {Promise<void>}
 */

async function fetchUserListings() {
  if (!accessToken || !username) {
    userListings = [];
    showLoadingIndicator();
    await fetchOtherListings();
    hideLoadingIndicator();
    return;
  }

  showLoadingIndicator();

  try {
    const response = await fetch(
      `${PROFILE_ENDPOINT(username)}/listings?_sort=created&sortOrder=desc&_bids=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );
    const { data } = await response.json();
    userListings = data.slice(0, 9);
    await fetchOtherListings();
  } catch (error) {
    console.error("Error retrieving user's auctions:", error);
  } finally {
    hideLoadingIndicator();
  }
}

/**
 * Fetches other users' listings from the API.
 * Filters out current user's listings if logged in.
 *
 * @async
 * @function fetchOtherListings
 * @returns {Promise<void>}
 */

async function fetchOtherListings() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auction/listings?_sort=created&sortOrder=desc&_bids=true&_seller=true&limit=100`,
      {
        headers: {
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    const { data } = await response.json();
    console.log("All auctions:", data);

    if (username) {
      otherListings = data.filter((listing) => listing.seller?.name !== username);
    } else {
      otherListings = data;
    }

    renderListings();
  } catch (error) {
    console.error("Error retrieving other people's auctions:", error);
  }
}

/**
 * Renders listings to the DOM based on user state or provided custom array.
 *
 * @function renderListings
 * @param {Array<Object>} [customListings=null] - Optional custom listings to render (e.g., from search/filter)
 */

export function renderListings(customListings = null) {
    const messageElement = document.getElementById("noResultsMessage");
    container.innerHTML = "";
  
    const listingsToRender = customListings
      ? customListings
      : showAll
      ? [...userListings, ...otherListings]
      : userListings.length > 0
      ? userListings
      : otherListings.slice(0, 9);
  
    // Show/hide message
    if (messageElement) {
      if (listingsToRender.length === 0) {
        messageElement.classList.remove("d-none");
      } else {
        messageElement.classList.add("d-none");
      }
    }
  
    listingsToRender.forEach((listing) => {
      const image =
        listing.media?.[0]?.url ||
        "https://images.pexels.com/photos/140134/pexels-photo-140134.jpeg";
      const alt = listing.media?.[0]?.alt || listing.title;
      const endsAt = listing.endsAt;
  
      const bids = listing.bids || [];
      const highestBid = bids.length
        ? Math.max(...bids.map((bid) => bid.amount))
        : 0;
  
      container.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
           <a href="/pages/auctionDetail.html?id=${listing.id}">
            <img src="${image}" class="card-img-top object-fit-cover" style="height: 200px;" alt="${alt}"
            onerror="this.onerror=null; this.src='https://images.pexels.com/photos/140134/pexels-photo-140134.jpeg';" /></a>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${listing.title}</h5>
              <p class="card-text">${listing.description || "No description"}</p>
              <div class="mt-auto">
                <div class="d-flex justify-content-between">
                  <div>
                    <strong>Highest bid:</strong>
                    <div class="bid-amount">$${highestBid}</div>
                  </div>
                  <div>
                    <strong>Time left:</strong>
                    <div class="countdown time-left" data-endsat="${endsAt}">${formatTimeLeft(endsAt)}</div>
                  </div>
                </div>
                <div class="d-flex justify-content-between mt-3">
                  <button class="btn btn-primary fw-bold"
                    ${accessToken ? `data-bs-toggle="modal" data-bs-target="#bidModal" data-bid-id="${listing.id}"` : "disabled"}>
                    ${accessToken ? "Bid" : "Log in to bid"}
                  </button>
                  <a href="/pages/auctionDetail.html?id=${listing.id}" class="btn btn-secondary fw-bold">
                    View
                  </a>
                </div> 
              </div>
            </div>
          </div>
        </div>
      `;
    });
  
    const shouldShowButton = accessToken
      ? !showAll && otherListings.length > 0
      : !showAll && otherListings.length > 9;
  
    loadMoreBtn.style.display = shouldShowButton ? "block" : "none";
  }
  
/**
 * Returns all auction listings (both user and others) as a combined array.
 *
 * @function getAllListings
 * @returns {Array<Object>} All loaded auction listings.
 */

// Place this below along with renderListings
export function getAllListings() {
    return [...userListings, ...otherListings];
  }

setInterval(() => {
  document.querySelectorAll(".countdown").forEach((el) => {
    el.textContent = formatTimeLeft(el.dataset.endsat);
  });
}, 1000);

loadMoreBtn.addEventListener("click", () => {
  showAll = true;
  renderListings();
});

fetchUserListings();

/**
 * Makes it possible for external files (e.g. placeBid.js) to refresh auction listings.
 * @global
 */

// This allows placeBid.js to call it
window.refreshListings = async function () {
    await fetchUserListings(); 
};

  
