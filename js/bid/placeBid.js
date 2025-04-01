/* global bootstrap */

import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { showMessage } from "../messages/messages.js";
import { fetchUserProfile } from "../profile/profile.js";

export async function placeBid(listingId, amount, currentHighestBid) {
  console.log("Starter bud-innsending...");
  console.log("listingId:", listingId);
  console.log("amount:", amount);
  console.log("currentHighestBid:", currentHighestBid);

  const accessToken = retrieveFromLocalStorage("accessToken");
  const username = retrieveFromLocalStorage("username");

  //  Ikke logget inn
  if (!accessToken || !username) {
    showMessage(
      "#bidMessageContainer",
      "Du må være logget inn for å legge inn bud.",
      "danger",
    );
    return;
  }

  //  Bud for lavt
  if (amount <= currentHighestBid) {
    console.warn("Budet er for lavt");
    showMessage(
      "#bidMessageContainer",
      `Budet må være høyere enn høyeste bud (${currentHighestBid} credits).`,
      "danger",
    );
    return;
  }

  const bid = { amount: Number(amount) };

  try {
    console.log("Sender følgende bud til API:", bid);

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
      },
    );

    const data = await response.json();
    console.log("API-respons etter innsending:", data);

    //  Feil fra API
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Noe gikk galt");
    }

    //  Budet ble lagt inn
    showMessage(
      "#bidMessageContainer",
      "Budet ditt er lagt inn!",
      "success",
    );

    //  Oppdater profil
    await fetchUserProfile(username);

    //  Lukk modal etter 1.5 sek
    setTimeout(() => {
      const modalElement = document.getElementById("bidModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }, 1500);
  } catch (error) {
    console.error("Feil under innsending av bud:", error);
    showMessage(
      "#bidMessageContainer",
      `Kunne ikke sende bud: ${error.message}`,
      "danger",
    );
  }
}
