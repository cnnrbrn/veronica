import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";

const form = document.getElementById("editAuctionForm");
const titleInput = document.getElementById("editTitle");
const descInput = document.getElementById("editDescription");
const imageInput = document.getElementById("editImage");
const message = document.getElementById("editMessageContainer");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const auctionId = new URLSearchParams(window.location.search).get("id");
  const accessToken = retrieveFromLocalStorage("accessToken");

  // Legg til fallback sluttdato (kreves av Noroff API)
  const fallbackEndDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

  const updatedAuction = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    endsAt: fallbackEndDate,
  };

  //  MEDIA må være et array av objekt(er)
  const imageUrl = imageInput.value.trim();
  if (imageUrl !== "") {
    updatedAuction.media = [{ url: imageUrl }];
  }

  // 🔍 Logg hele payloaden før du sender
  console.log(" Prøver å sende dette til API:", updatedAuction);

  try {
    const response = await fetch(`${API_BASE_URL}/auction/listings/${auctionId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(updatedAuction),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(" Feil ved oppdatering:", data.errors?.[0]?.message || data);
      message.innerHTML = `
        <div class="alert alert-danger">
          Update failed: ${data.errors?.[0]?.message || "Unknown error"}
        </div>`;
      return;
    }

    //  Alt gikk bra!
    console.log(" Oppdatering OK:", data);
    message.innerHTML = `<div class="alert alert-success">Auction updated!</div>`;
    setTimeout(() => location.reload(), 1000);
  } catch (error) {
    console.error(" Network- eller kodefeil:", error);
    message.innerHTML = `<div class="alert alert-danger">Something went wrong. Please try again.</div>`;
  }
});
