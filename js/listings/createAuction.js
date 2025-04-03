// js/listings/createAuction.js
import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";

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

    // ✅ Vis alert først
    alert(" Auksjonen ble opprettet!");

    // ✅ Lukk modal og nullstill skjema
    document.getElementById("createAuctionForm").reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("createAuctionModal"));
    modal.hide();

    // ✅ Send bruker til forsiden etter kort tid
    setTimeout(() => {
      window.location.href = "../../index.html";
    }, 500); // 0.5 sekund

  } catch (error) {
    console.error(" Create auction failed:", error);
    alert("Failed to create auction.");
  }
}

document.getElementById("createAuctionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  createAuction();
});
