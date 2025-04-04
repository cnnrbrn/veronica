// js/auction/auctionDetail.js

import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { fetchUserProfile } from "../profile/profile.js";
import { placeBid } from "../bid/placeBid.js";

async function main() {
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");
  console.log("Hentet listing ID fra URL:", listingId);

  if (!listingId) {
    console.warn("❌ Ikke en auksjonsdetalj-side. Stopper scriptet.");
    return; // ✅ Nå er dette lov
  }

  const username = retrieveFromLocalStorage("username");
  console.log("Hentet brukernavn fra localStorage:", username);
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

// Resten av funksjonene er uendret ⬇️

async function getAuctionDetail(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/auction/listings/${id}?_bids=true`, {
      headers: {
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const { data } = await response.json();
    console.log("Auksjonsdata fra API:", data);

    document.getElementById("auctionTitle").textContent = data.title;
    document.getElementById("auctionOwner").textContent = `By ${data.seller?.name || "Unknown"}`;
    document.getElementById("auctionDescription").textContent = data.description;

    const image = data.media?.[0]?.url || "https://via.placeholder.com/600x400?text=No+Image";
    const alt = data.media?.[0]?.alt || data.title || "Auction image";
    document.getElementById("auctionImage").src = image;
    document.getElementById("auctionImage").alt = alt;

    const highestBid = data.bids?.length > 0
      ? Math.max(...data.bids.map((bid) => bid.amount))
      : 0;
    document.getElementById("currentBid").textContent = `$${highestBid}`;

    startCountdown(data.endsAt);
    renderBiddingHistory(data.bids);
  } catch (error) {
    console.error("Feil ved henting av auksjon:", error);
    document.body.innerHTML = "<p class='text-danger'>Kunne ikke laste auksjonsdetaljer.</p>";
  }
}

function startCountdown(endTime) {
  const timeLeftElement = document.getElementById("timeLeft");

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
  const timer = setInterval(updateCountdown, 1000);
}

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
    .forEach((bid) => {
      const bidDate = new Date(bid.created).toLocaleString();
      const item = document.createElement("div");
      item.className = "list-group-item";
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div><strong>${bid.bidder?.name || "Unknown user"}</strong> placed a bid of $${bid.amount}</div>
          <small class="text-muted">${bidDate}</small>
        </div>
      `;
      historyContainer.appendChild(item);
    });
}
