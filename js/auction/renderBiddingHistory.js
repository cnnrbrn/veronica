/**
 * Viser budhistorikk for en spesifikk auksjon.
 * @param {Array} bids - Liste over bud fra API.
 */
export function renderBiddingHistory(bids) {
    console.log("Mottatt budliste:", bids);
  
    const historyContainer = document.getElementById("biddingHistory");
  
    if (!historyContainer) {
      console.error("Fant ikke element med id='biddingHistory'");
      return;
    }
  
    historyContainer.innerHTML = "";
  
    if (bids?.length) {
      // Bruk slice() for å ikke endre original array
      bids
        .slice()
        .reverse()
        .forEach((bid, index) => {
          const bidDate = new Date(bid.created).toLocaleString();
  
          console.log(` Bud #${index + 1}:`, {
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
      console.warn("Ingen bud funnet – viser standardmelding");
      historyContainer.innerHTML = "<p class='text-muted'>No bids yet.</p>";
    }
  }
  