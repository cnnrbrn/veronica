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

    // Filter on search
    let filtered = allListings.filter((listing) => {
      const title = listing.title?.toLowerCase() || "";
      const description = listing.description?.toLowerCase() || "";
      return title.includes(query) || description.includes(query);
    });

    // Sort
    const sorted = filterListings(filtered, sortBy);

    // Show the result
    renderListings(sorted);
  } catch (error) {
    console.error("Error while searching/sorting:", error);
  }
}