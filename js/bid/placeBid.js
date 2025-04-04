/* global bootstrap */

import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { showMessage } from "../messages/messages.js";
import { fetchUserProfile } from "../profile/profile.js";

/**
 * Sender bud til API og oppdaterer UI
 * @param {string} listingId - ID for auksjonen
 * @param {number} amount - Budbeløp
 * @param {number} currentHighestBid - Høyeste eksisterende bud
 * @param {function} [updateAuctionView] - (valgfri) Funksjon for å oppdatere auksjonsvisning etter bud
 */
export async function placeBid(listingId, amount, currentHighestBid, updateAuctionView) {
  console.log(" Starter bud-innsending...");
  console.log("listingId:", listingId);
  console.log("amount:", amount);
  console.log("currentHighestBid:", currentHighestBid);

  const accessToken = retrieveFromLocalStorage("accessToken");
  const username = retrieveFromLocalStorage("username");

  if (!accessToken || !username) {
    showMessage(
      "#bidMessageContainer",
      "Du må være logget inn for å legge inn bud.",
      "danger"
    );
    return;
  }

  if (amount <= currentHighestBid) {
    showMessage(
      "#bidMessageContainer",
      `Budet må være høyere enn høyeste bud (${currentHighestBid} credits).`,
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
    console.log(" Bud sendt, respons:", data);

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Noe gikk galt");
    }

    showMessage("#bidMessageContainer", " Budet ditt er lagt inn!", "success");

    await fetchUserProfile(username);

    //  Oppdater visning på detaljside eller forside
    if (typeof updateAuctionView === "function") {
      await updateAuctionView(listingId); // auctionDetail
    } else if (typeof window.refreshListings === "function") {
      await window.refreshListings(); // index.html
    }

    //  Lukk modal
    setTimeout(() => {
      const modalElement = document.getElementById("bidModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
    }, 1500);
  } catch (error) {
    console.error(" Feil ved bud:", error);
    showMessage(
      "#bidMessageContainer",
      `Kunne ikke sende bud: ${error.message}`,
      "danger"
    );
  }
}
