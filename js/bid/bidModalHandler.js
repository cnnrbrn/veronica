import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { placeBid } from "./placeBid.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { showMessage } from "../messages/messages.js";

document.addEventListener("DOMContentLoaded", () => {
  const bidModal = document.getElementById("bidModal");
  const bidForm = document.getElementById("bidForm");
  const bidAmountInput = document.getElementById("bidAmount");
  const listingIdInput = document.getElementById("listingId");

  bidModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const listingId = button?.getAttribute("data-bid-id");

    // Remove old messages
    const messageContainer = document.querySelector("#bidMessageContainer");
    if (messageContainer) {
      messageContainer.innerHTML = "";
      console.log("Removed old message after modal was displayed");
    }

    // Reset input field
    if (bidAmountInput) {
      bidAmountInput.value = "";
    }

    if (listingId) {
      listingIdInput.value = listingId;
      console.log("Modal opened for auction ID:", listingId);
    } else {
      console.warn("Could not find listingId in button");
    }
  });

  // When the bid form is submitted
  bidForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const listingId = listingIdInput.value;
    const amount = Number(bidAmountInput.value);

    if (!listingId || !amount) {
      console.warn("Missing input for bid");
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

      console.log("Current highest bid:", currentHighestBid);

      await placeBid(listingId, amount, currentHighestBid);
    } catch (error) {
      console.error("Error retrieving auction data:", error);
      showMessage(
        "#bidMessageContainer",
        `Failed to retrieve bid information: ${error.message}`,
        "error",
      );
    }
  });
});
