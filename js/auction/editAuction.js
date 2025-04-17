import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { deleteListing } from "../listings/deleteListing.js";

// ✅ Vent til DOM er klar
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editAuctionForm");
  const titleInput = document.getElementById("editTitle");
  const descInput = document.getElementById("editDescription");
  const imageInput = document.getElementById("editImage");
  const message = document.getElementById("editMessageContainer");
  const deleteButton = document.getElementById("deleteAuctionButton");

  // ❌ Ikke bruk `return` her med mindre vi er inni en funksjon
  if (!form || !titleInput || !descInput || !imageInput || !message || !deleteButton) {
    console.warn("❌ One or more form elements were not found in the DOM.");
    return; // ✅ Nå er vi inni en funksjon (DOMContentLoaded), så det er lov
  }

  // 🗑️ DELETE
  deleteButton.addEventListener("click", () => {
    const auctionId = new URLSearchParams(window.location.search).get("id");
    deleteListing(auctionId);
  });

  // ✏️ UPDATE
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const auctionId = new URLSearchParams(window.location.search).get("id");
    const accessToken = retrieveFromLocalStorage("accessToken");
    const fallbackEndDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

    const updatedAuction = {
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      endsAt: fallbackEndDate,
    };

    const imageUrl = imageInput.value.trim();
    if (imageUrl !== "") {
      updatedAuction.media = [{ url: imageUrl }];
    }

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
        console.error("❌ Update error:", data.errors?.[0]?.message || data);
        message.innerHTML = `
          <div class="alert alert-danger">
            Update failed: ${data.errors?.[0]?.message || "Unknown error"}
          </div>`;
        return;
      }

      console.log("✅ Update success:", data);
      message.innerHTML = `<div class="alert alert-success">Auction updated!</div>`;
      setTimeout(() => location.reload(), 1000);
    } catch (error) {
      console.error("❌ Network error:", error);
      message.innerHTML = `<div class="alert alert-danger">Something went wrong. Please try again.</div>`;
    }
  });
});

