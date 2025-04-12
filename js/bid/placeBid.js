/* global bootstrap */

import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { showMessage } from "../messages/messages.js";
import { fetchUserProfile } from "../profile/profile.js";

/**
 * Sends bids to API and updates UI
 * @param {string} listingId - ID for the auction
 * @param {number} amount - Bid amount
 * @param {number} currentHighestBid - Highest existing bid
 * @param {function} [updateAuctionView] - (optional) Function to update auction view after bid
 */
export async function placeBid(listingId, amount, currentHighestBid, updateAuctionView) {
  console.log(" Starting bid submission...");
  console.log("listingId:", listingId);
  console.log("amount:", amount);
  console.log("currentHighestBid:", currentHighestBid);

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
    console.log(" Bid sent, response:", data);

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
    console.error(" Bid error:", error);
    showMessage(
      "#bidMessageContainer",
      `Couldn't send a message: ${error.message}`,
      "danger"
    );
  }
}
