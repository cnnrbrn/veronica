import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { fetchUserProfile } from "../profile/profile.js";
import { placeBid } from "../bid/placeBid.js";

async function main() {
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");
  console.log(" Retrieved listing ID from URL:", listingId);

  if (!listingId) {
    console.warn(" Not an auction details page. Stopping the script.");
    return;
  }

  const username = retrieveFromLocalStorage("username");
  console.log(" Username from localStorage:", username);
  if (username) fetchUserProfile(username);

  await getAuctionDetail(listingId);

  // Bid-form
  document.getElementById("bidForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = document.getElementById("bidAmount").value;
    const currentBidText = document.getElementById("currentBid").textContent.replace("$", "");
    const currentHighestBid = parseFloat(currentBidText) || 0;
    placeBid(listingId, amount, currentHighestBid, getAuctionDetail);
  });
}

main();

//  Get auction details
async function getAuctionDetail(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/auction/listings/${id}?_bids=true&_seller=true&_bidders=true`, {
      headers: {
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const { data } = await response.json();
    console.log("📦 Auksjonsdata fra API:", data);

    document.getElementById("auctionTitle").textContent = data.title;
    document.getElementById("auctionOwner").textContent = `By ${data.seller?.name || "Unknown"}`;
    document.getElementById("auctionDescription").textContent = data.description;

    // Show edit button only for owner
    const username = retrieveFromLocalStorage("username");
    const editButton = document.getElementById("editAuctionButton");

    console.log(" Button found?", editButton);
    console.log(" Username:", username);
    console.log(" Auction seller:", data.seller?.name);
    console.log(" Same user?", data.seller?.name?.toLowerCase() === username?.toLowerCase());

    if (data.seller?.name?.toLowerCase() === username?.toLowerCase()) {
      editButton.classList.remove("d-none");
      document.getElementById("editTitle").value = data.title || "";
      document.getElementById("editDescription").value = data.description || "";
      document.getElementById("editImage").value = data.media?.[0]?.url || "";
    }

    const image = data.media?.[0]?.url || "https://images.pexels.com/photos/140134/pexels-photo-140134.jpeg";
    const alt = data.media?.[0]?.alt || data.title || "Auction image";
    
    const auctionImageEl = document.getElementById("auctionImage");
    auctionImageEl.src = image;
    auctionImageEl.alt = alt;
    
    // Add fallback if image cannot be loaded
    auctionImageEl.onerror = function () {
      this.src = "https://images.pexels.com/photos/140134/pexels-photo-140134.jpeg";
    };
    
    const highestBid = data.bids?.length > 0
      ? Math.max(...data.bids.map((bid) => bid.amount))
      : 0;
    document.getElementById("currentBid").textContent = `$${highestBid}`;

    startCountdown(data.endsAt);
    renderBiddingHistory(data.bids);

  } catch (error) {
    console.error(" Error retrieving auction:", error);
    document.body.innerHTML = "<p class='text-danger'>Could not load auction details..</p>";
  }
}

function startCountdown(endTime) {
  const timeLeftElement = document.getElementById("timeLeft");
  let timer; // Define hours before using in updateCountdown

  function updateCountdown() {
    const now = new Date();
    const timeLeft = new Date(endTime) - now;

    if (timeLeft <= 0) {
      timeLeftElement.textContent = "Auction ended";
      clearInterval(timer);
      return;
    }

    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    timeLeftElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
}

//  Show bid history with avatar
function renderBiddingHistory(bids = []) {
  const historyContainer = document.getElementById("biddingHistory");
  historyContainer.innerHTML = "";

  if (bids.length === 0) {
    historyContainer.innerHTML = "<p class='text-muted'>No bids yet.</p>";
    return;
  }

  bids
    .slice()
    .reverse()
    .forEach((bid, index) => {
      const bidDate = new Date(bid.created).toLocaleString();
      const bidderName = bid.bidder?.name || "Unknown user";
      const avatar = bid.bidder?.avatar?.url || "https://via.placeholder.com/40";

      console.log(` Bid #${index + 1}`, {
        name: bidderName,
        avatar,
        amount: bid.amount,
        date: bidDate,
      });

      const item = document.createElement("div");
      item.className = "list-group-item";
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3">
            <img 
              src="${avatar}" 
              alt="${bidderName}" 
              class="rounded-circle border border-secondary shadow-sm" 
              width="40" height="40"
            >
            <div>
              <strong>${bidderName}</strong><br>
              <span>Bid: $${bid.amount}</span>
            </div>
          </div>
          <small class="text-muted">${bidDate}</small>
        </div>
      `;

      historyContainer.appendChild(item);
    });
}
