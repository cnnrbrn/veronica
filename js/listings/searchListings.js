import { getAllListings, renderListings } from "./getListings.js";
import { filterListings } from "./filterListings.js";

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

searchInput?.addEventListener("input", handleSearchAndFilter);
sortSelect?.addEventListener("change", handleSearchAndFilter);

async function handleSearchAndFilter() {
  const query = searchInput.value.toLowerCase();
  const sortBy = sortSelect.value;

  try {
    const allListings = await getAllListings();

    // Filter på søk
    let filtered = allListings.filter((listing) => {
      const title = listing.title?.toLowerCase() || "";
      const description = listing.description?.toLowerCase() || "";
      return title.includes(query) || description.includes(query);
    });

    // ↕️ Sortér
    const sorted = filterListings(filtered, sortBy);

    // Vis resultatet
    renderListings(sorted);
  } catch (error) {
    console.error("Feil under søk/sortering:", error);
  }
}