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
  