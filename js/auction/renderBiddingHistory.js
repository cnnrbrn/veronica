/**
 * Shows bid history for a specific auction.
 * @param {Array} bids - List of bids from API.
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
      // Use slice() to not change the original array
      bids
        .slice()
        .reverse()
        .forEach((bid, index) => {
          const bidDate = new Date(bid.created).toLocaleString();
  
          console.log(` Bid #${index + 1}:`, {
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
  