// js/listings/createAuction.js
import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";

/**
 * Creates a new auction listing by sending form data to the API.
 *
 * - Collects values from the "Create Auction" form
 * - Formats them into a listing object
 * - Sends the listing as a POST request to the API
 * - Shows alert, resets form, closes modal, and redirects on success
 *
 * @async
 * @function createAuction
 * @returns {Promise<void>}
 *
 * @example
 * createAuction(); // Called on form submit
 */

export async function createAuction() {
  const accessToken = retrieveFromLocalStorage("accessToken");
  const title = document.getElementById("auctionTitle").value;
  const description = document.getElementById("auctionDescription").value;
  const endsAt = document.getElementById("auctionEndsAt").value;
  const mediaUrl = document.getElementById("auctionMedia").value;

  const listing = {
    title,
    description,
    endsAt: new Date(endsAt).toISOString(),
    media: mediaUrl ? [{ url: mediaUrl }] : [],
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auction/listings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(listing),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to create listing.");
    }

    //  Show alert first
    alert("Auksjonen ble opprettet!");

    //  Close modal and reset form
    document.getElementById("createAuctionForm").reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("createAuctionModal"));
    modal.hide();

    //  Send user to the front page after a short time
    setTimeout(() => {
      window.location.href = "../../index.html";
    }, 500); // 0.5 sekund

  } catch (error) {
    console.error(" Create auction failed:", error);
    alert("Failed to create auction.");
  }
}

/**
 * Event listener that handles form submission for creating a new auction.
 * Prevents default form submission and calls createAuction().
 */

document.getElementById("createAuctionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  createAuction();
});
