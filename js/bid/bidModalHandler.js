import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { placeBid } from "./placeBid.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { showMessage } from "../messages/messages.js";

/**
 * Initializes the bid modal and handles form submission for placing a bid.
 *
 * - Sets up event listener for when the modal is shown
 * - Resets input and messages
 * - On submit, retrieves listing data and places a bid
 *
 * @function handleBidModal
 * @event DOMContentLoaded
 * @returns {void}
 */

document.addEventListener("DOMContentLoaded", () => {
  const bidModal = document.getElementById("bidModal");
  const bidForm = document.getElementById("bidForm");
  const bidAmountInput = document.getElementById("bidAmount");
  const listingIdInput = document.getElementById("listingId");

   // When the modal is opened
  bidModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const listingId = button?.getAttribute("data-bid-id");

    // Remove old messages
    const messageContainer = document.querySelector("#bidMessageContainer");
    if (messageContainer) {
      messageContainer.innerHTML = "";
    }

    // Reset input field
    if (bidAmountInput) {
      bidAmountInput.value = "";
    }

    if (listingId) {
      listingIdInput.value = listingId;
    } 
  });

  // When the bid form is submitted
  bidForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const listingId = listingIdInput.value;
    const amount = Number(bidAmountInput.value);

    if (!listingId || !amount) {
      showMessage("#bidMessageContainer", " Fill in bid amount.", "error");
      return;
    }

    try {
      const accessToken = retrieveFromLocalStorage("accessToken");
      const username = retrieveFromLocalStorage("username");

      const listingRes = await fetch(
        `${API_BASE_URL}/auction/listings/${listingId}?_bids=true`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
          },
        },
      );

      const listingData = await listingRes.json();
      const currentHighestBid = listingData.data?.bids?.length
        ? Math.max(...listingData.data.bids.map((b) => b.amount))
        : 0;

      await placeBid(listingId, amount, currentHighestBid);
    } catch (error) {
      showMessage(
        "#bidMessageContainer",
        `Failed to retrieve bid information: ${error.message}`,
        "error",
      );
    }
  });
});
