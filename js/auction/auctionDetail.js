// auctionDetail.js

import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { fetchUserProfile } from "../profile/profile.js";

import { placeBid } from "../bid/placeBid.js"; //  Husk riktig path!

//  Hent ID fra URL
const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");
console.log("Hentet listing ID fra URL:", listingId);

//  Hent brukernavn og vis credits
const username = retrieveFromLocalStorage("username");
console.log("Hentet brukernavn fra localStorage:", username);

if (username) {
  fetchUserProfile(username);
} else {
  console.warn("Ingen brukernavn funnet i localStorage.");
}

if (!listingId) {
  console.error("Ingen ID i URL");
  document.body.innerHTML = "<p class='text-danger'>Missing auction ID.</p>";
} else {
  getAuctionDetail(listingId);
}

//  Hovedfunksjon for å hente og vise auksjonsdetaljer
async function getAuctionDetail(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/auction/listings/${id}?_bids=true`, {
      headers: {
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const { data } = await response.json();
    console.log("Auksjonsdata fra API:", data);
    console.log("Bud som kom fra API:", data.bids);

    //  Oppdater DOM
    document.getElementById("auctionTitle").textContent = data.title;
    document.getElementById("auctionOwner").textContent = `By ${data.seller?.name || "Unknown"}`;
    document.getElementById("auctionDescription").textContent = data.description;

    const image = data.media?.[0]?.url || "https://via.placeholder.com/600x400?text=No+Image";
    const alt = data.media?.[0]?.alt || data.title || "Auction image";

    document.getElementById("auctionImage").src = image;
    document.getElementById("auctionImage").alt = alt;

    //  Høyeste bud
    const highestBid = data.bids?.length > 0
      ? Math.max(...data.bids.map((bid) => bid.amount))
      : 0;

    document.getElementById("currentBid").textContent = `$${highestBid}`;

    //  Start nedtelling
    startCountdown(data.endsAt);

    //  Budhistorikk
    renderBiddingHistory(data.bids);

  } catch (error) {
    console.error("Feil ved henting av auksjon:", error);
    document.body.innerHTML = "<p class='text-danger'>Could not load auction details. Please try again later.</p>";
  }
}

//  Funksjon for nedtelling i sanntid
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

  updateCountdown(); // initial call
  const timer = setInterval(updateCountdown, 1000);
}

//  Funksjon for å vise budhistorikk
function renderBiddingHistory(bids = []) {
  const historyContainer = document.getElementById("biddingHistory");
  historyContainer.innerHTML = "";

  console.log("Viser budhistorikk:", bids);

  if (bids.length === 0) {
    historyContainer.innerHTML = "<p class='text-muted'>No bids yet.</p>";
    return;
  }

  bids
    .slice()
    .reverse()
    .forEach((bid, index) => {
      const bidDate = new Date(bid.created).toLocaleString();

      console.log(` Bud #${index + 1}:`, {
        name: bid.bidder?.name,
        amount: bid.amount,
        date: bidDate,
      });

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

//  Bid-form innsending (Auction Detail-side)
document.getElementById("bidForm")?.addEventListener("submit", (e) => {
    e.preventDefault(); //  Hindre reload
  
    const amount = document.getElementById("bidAmount").value;
  
    if (!amount) return;
  
    const currentBidText = document.getElementById("currentBid").textContent.replace("$", "");
    const currentHighestBid = parseFloat(currentBidText) || 0;
  
    console.log("Bruker forsøker å by i modal:", amount);
  
    //  Bruk listingId fra URL her!
    placeBid(listingId, amount, currentHighestBid);
  });
  
