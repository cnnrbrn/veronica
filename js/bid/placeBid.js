/* global bootstrap */
import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { showMessage } from "../messages/messages.js";
import { fetchUserProfile } from "../profile/profile.js";
import { showLoadingIndicator, hideLoadingIndicator } from "../utilities/loader.js";  

/**
 * Places a bid on a specific auction listing by sending the bid to the API.
 * Displays feedback messages, closes modal, updates credits and listing view if successful.
 *
 * @param {string} listingId - The ID of the auction listing to place the bid on.
 * @param {number} amount - The amount to bid (must be higher than currentHighestBid).
 * @param {number} currentHighestBid - The current highest bid on the listing.
 * @param {function} [updateAuctionView] - Optional callback to update auction UI after bidding.
 *
 * @returns {Promise<void>}
 *
 * @example
 * ```js
 * placeBid("abc123", 500, 400, refreshAuction);
 * ```
 */

export async function placeBid(listingId, amount, currentHighestBid, updateAuctionView) {
  const accessToken = retrieveFromLocalStorage("accessToken");
  const username = retrieveFromLocalStorage("username");

  if (!accessToken || !username) {
    showMessage(
      "#bidMessageContainer",
      "You must be logged in to place a bid.",
      "danger"
    );
    return;
  }

  if (amount <= currentHighestBid) {
    showMessage(
      "#bidMessageContainer",
      `The bid must be higher than the highest bid. (${currentHighestBid} credits).`,
      "danger"
    );
    return;
  }

  const bid = { amount: Number(amount) };
  showLoadingIndicator();

  try {
    const response = await fetch(
      `${API_BASE_URL}/auction/listings/${listingId}/bids`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(bid),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Something went wrong");
    }

    showMessage("#bidMessageContainer", " Your bid has been placed!", "success");
    await fetchUserProfile(username);

    //  Refresh view on detail page or front page
    if (typeof updateAuctionView === "function") {
      await updateAuctionView(listingId); // auctionDetail
    } else if (typeof window.refreshListings === "function") {
      await window.refreshListings(); // index.html
    }

    //  Close modal
    setTimeout(() => {
      const modalElement = document.getElementById("bidModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
    }, 1500);
  } catch (error) {

    showMessage(
      "#bidMessageContainer",
      `Couldn't send a message: ${error.message}`,
      "danger"
    );
  } 
  finally {
    hideLoadingIndicator(); 
  }
}
