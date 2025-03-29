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

    // Fjern gamle meldinger
    const messageContainer = document.querySelector("#bidMessageContainer");
    if (messageContainer) {
      messageContainer.innerHTML = "";
      console.log("🧹 Fjernet gammel melding etter at modal ble vist");
    }

    // Nullstill input-felt
    if (bidAmountInput) {
      bidAmountInput.value = "";
    }

    if (listingId) {
      listingIdInput.value = listingId;
      console.log("📌 Modal åpnet for auksjon ID:", listingId);
    } else {
      console.warn("⚠️ Fant ikke listingId i knapp");
    }
  });

  // Når budskjema sendes inn
  bidForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const listingId = listingIdInput.value;
    const amount = Number(bidAmountInput.value);

    if (!listingId || !amount) {
      console.warn("⚠️ Mangler input for bud");
      showMessage("#bidMessageContainer", "❗ Fyll inn budbeløp.", "error");
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

      console.log("📊 Nåværende høyeste bud:", currentHighestBid);

      await placeBid(listingId, amount, currentHighestBid);
    } catch (error) {
      console.error("❌ Feil ved henting av auksjonsdata:", error);
      showMessage(
        "#bidMessageContainer",
        `❗ Klarte ikke hente budinformasjon: ${error.message}`,
        "error",
      );
    }
  });
});
