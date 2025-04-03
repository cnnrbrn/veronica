import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";

export async function deleteListing(listingId) {
  const accessToken = retrieveFromLocalStorage("accessToken");

  const confirmDelete = confirm("❗ Are you sure you want to delete this auction?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE_URL}/auction/listings/${listingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors?.[0]?.message || "Could not delete auction.");
    }

    alert("🗑️ Auksjonen ble slettet!");
    // Du kan f.eks. sende brukeren tilbake til forsiden:
    window.location.href = "../../index.html";
  } catch (error) {
    console.error("❌ Delete failed:", error);
    alert(`❌ Kunne ikke slette: ${error.message}`);
  }
}
