/**
 * Renders the bid history for a specific auction in the DOM.
 *
 * Loops through an array of bids and displays them with bidder name,
 * amount, and formatted date. If there are no bids, it shows a message.
 *
 * @param {Array<Object>} bids - List of bid objects from the API. Each bid should contain:
 * @param {string} bids[].bidderName - Name of the user who placed the bid.
 * @param {number} bids[].amount - Bid amount in credits.
 * @param {string} bids[].created - ISO date string of when the bid was placed.
 *
 * @example
 * ```js
 * renderBiddingHistory([
 *   { bidderName: "Lisa", amount: 100, created: "2025-04-19T12:00:00Z" },
 *   { bidderName: "Tom", amount: 150, created: "2025-04-19T12:05:00Z" },
 * ]);
 * ```
 */
export function renderBiddingHistory(bids) {
  console.log("Bid list received:", bids);

  const historyContainer = document.getElementById("biddingHistory");

  if (!historyContainer) {
    console.error("Element with id='biddingHistory' not found");
    return;
  }

  historyContainer.innerHTML = "";

  if (bids?.length) {
    // Use slice() to not change the original array.
    bids
      .slice()
      .reverse()
      .forEach((bid, index) => {
        const bidDate = new Date(bid.created).toLocaleString();

        console.log(`Bid #${index + 1}:`, bid);  // Log the full bid object to inspect its structure


        console.log(`Bid #${index + 1}:`, {
          name: bid.bidderName,
          amount: bid.amount,
          date: bidDate,
        });

        const item = document.createElement("div");
        item.className = "list-group-item";
        item.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div><strong>${bid.bidderName}</strong> placed a bid of  $${bid.amount}</div>
            <small class="text-muted">${bidDate}</small>
          </div>
        `;

        historyContainer.appendChild(item);
      });
  } else {
    console.warn("No bids found - shows default message");
    historyContainer.innerHTML = "<p class='text-muted'>No bids yet.</p>";
  }
}
