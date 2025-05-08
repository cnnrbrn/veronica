import { API_KEY, API_BASE_URL } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";

/**
 * Fetches and displays the user's most recent bids per listing.
 *
 * - Gets the access token and username from localStorage
 * - Sends a GET request to the bids endpoint
 * - Filters to show only the latest bid per listing
 * - Injects responsive Bootstrap cards into the DOM
 *
 * @async
 * @function fetchMyBids
 * @returns {Promise<void>}
 */

export async function fetchMyBids() {
  const username = retrieveFromLocalStorage("username");
  const accessToken = retrieveFromLocalStorage("accessToken");

  const container = document.getElementById("myBidsSection");

  if (!username || !accessToken || !container) return;

  try {
    const response = await fetch(`${API_BASE_URL}/auction/profiles/${username}/bids?_listings=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const { data } = await response.json();

    // Show only the latest bid per listing
    const latestBidsMap = new Map();

    data.forEach(bid => {
      const listingId = bid.listing.id;
      const existingBid = latestBidsMap.get(listingId);

      if (!existingBid || new Date(bid.created) > new Date(existingBid.created)) {
        latestBidsMap.set(listingId, bid);
      }
    });

    const latestBids = Array.from(latestBidsMap.values());

    if (latestBids.length === 0) {
      container.innerHTML = "<p class='text-center'>You haven't placed any bids yet.</p>";
      return;
    }

    container.innerHTML = latestBids.map(bid => {
      const image = bid.listing.media?.[0]?.url || "https://via.placeholder.com/300x300?text=Auction";
      const title = bid.listing.title || "Untitled";
      const amount = bid.amount;
      const created = new Date(bid.created).toLocaleString();
      const alt = bid.listing.media?.[0]?.alt || title;


      return `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${image}" class="card-img-top object-fit-cover" style="height: 200px;" alt="${alt}" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${title}</h5>
              <p><strong>Your bid:</strong> $${amount}</p>
              <p><strong>Bid placed:</strong> ${created}</p>
              <a href="/pages/auctionDetail.html?id=${bid.listing.id}" class="btn btn-primary mt-auto fw-bold">View Auction</a>
            </div>
          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Error fetching user bids:", error);
    container.innerHTML = "<p class='text-danger'>Could not load your bids.</p>";
  }
}
