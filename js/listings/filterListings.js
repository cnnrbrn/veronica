/**
 * Filters and sorts a list of auction listings based on selected criteria.
 *
 * Supported sort options:
 * - `"newest"`: Newest listings first
 * - `"oldest"`: Oldest listings first
 * - `"endingSoon"`: Listings that are ending soonest
 * - `default`: Returns the list without any sorting
 *
 * @param {Array<Object>} listings - Array of listing objects to sort.
 * @param {string} sortBy - The sort option selected by the user.
 * @returns {Array<Object>} The sorted array of listings.
 *
 * @example
 * filterListings(myListings, "newest");
 */

export function filterListings(listings, sortBy) {
    switch (sortBy) {
      case "newest":
        return listings.sort((a, b) => new Date(b.created) - new Date(a.created));
      case "oldest":
        return listings.sort((a, b) => new Date(a.created) - new Date(b.created));
      case "endingSoon":
        return listings.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
      default:
        return listings;
    }
  }
  