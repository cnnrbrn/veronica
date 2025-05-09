import { API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";

/**
 * Batch-uploads 9 predefined auction listings to the Noroff API.
 *
 * All listings have:
 * - title
 * - description
 * - media (image URL and alt text)
 * - static `endsAt` timestamp set in the future
 *
 * Each listing is sent using a `POST` request.
 *
 * @example
 * // This script runs on load and uploads the 9 listings
 */


const accessToken = retrieveFromLocalStorage("accessToken");
if (!accessToken) {
  alert("You must be logged in to submit auctions.");
  throw new Error("Token is missing");
}

// Set end date 5 months and 3 weeks in the future
const endsAt = "2025-08-17T13:11:59.363788"; // Calculated via system

const listings = [
  {
    title: "LP record",
    description: "LP record with classic jazz songs. In good condition.",
    media: [
      {
        url: "https://images.pexels.com/photos/6873715/pexels-photo-6873715.jpeg",
        alt: "LP record with orange color and a hand in the background",
      },
    ],
    endsAt,
  },
  {
    title: "Cassette",
    description:
      "Cassette tape with a mix of 80s and 90s rock music. In good condition.",
    media: [
      {
        url: "https://images.pexels.com/photos/6293133/pexels-photo-6293133.jpeg",
        alt: "Orange cassette tape",
      },
    ],
    endsAt,
  },
  {
    title: "Olympus Camera",
    description:
      "Old retro Olympus Camera that takes unique pictures. Very good condition.",
    media: [
      {
        url: "https://images.pexels.com/photos/7420960/pexels-photo-7420960.jpeg",
        alt: "Black and silver Olympus camera",
      },
    ],
    endsAt,
  },
  {
    title: "Super Nintendo Game Controller",
    description:
      "This cool retro Super Nintendo Game Controller can be yours. In good condition.",
    media: [
      {
        url: "https://images.pexels.com/photos/9201279/pexels-photo-9201279.jpeg",
        alt: "Grey super Nintendo controller",
      },
    ],
    endsAt,
  },
  {
    title: "VHS Cassette",
    description: "Old VHS cassette. In good condition.",
    media: [
      {
        url: "https://images.pexels.com/photos/12341035/pexels-photo-12341035.jpeg",
        alt: "Black VHS cassette",
      },
    ],
    endsAt,
  },
  {
    title: "Old Radio",
    description: "Old radio in retro style. In good condition.",
    media: [
      {
        url: "https://images.pexels.com/photos/17695480/pexels-photo-17695480/free-photo-of-old-fashioned-radio.jpeg",
        alt: "Brown and silver old radio",
      },
    ],
    endsAt,
  },
  {
    title: "Old Books",
    description:
      "Selling my old books from the 1900s. In good condition, but has some scratches.",
    media: [
      {
        url: "https://images.pexels.com/photos/13745412/pexels-photo-13745412.jpeg",
        alt: "Old books in brown and blue with a peach colored background",
      },
    ],
    endsAt,
  },
  {
    title: "Acoustic Guitar",
    description: "Selling my old tough guitar. In very good condition.",
    media: [
      {
        url: "https://images.pexels.com/photos/31159674/pexels-photo-31159674/free-photo-of-close-up-of-classical-guitar-in-soft-light.jpeg",
        alt: "Acoustic guitar",
      },
    ],
    endsAt,
  },
  {
    title: "Electric Guitar",
    description:
      "Selling this fantastic unique electric guitar. In very good condition.",
    media: [
      {
        url: "https://images.pexels.com/photos/16369624/pexels-photo-16369624/free-photo-of-guitar-and-cords.jpeg",
        alt: "Brown electric guitar",
      },
    ],
    endsAt,
  },
];

/**
 * Sends a single listing to the Noroff API.
 *
 * @param {Object} listing - The listing object with title, description, media, and endsAt.
 * @returns {Promise<void>}
 */

async function createListing(listing) {
  const response = await fetch(`${API_BASE_URL}/auction/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(listing),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error:", data.errors || response.statusText);
    return;
  }
}

/**
 * Loops over all predefined auctions and sends them to the API
 */
async function main() {
  try {
    for (const listing of listings) {
      await createListing(listing);
    }
  } catch (error) {
    console.error("Something went wrong while submitting listings:", error);
  }
}

// Start the upload process
main();


