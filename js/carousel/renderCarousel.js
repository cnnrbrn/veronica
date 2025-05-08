/**
 * Renders a custom image carousel for auction listings.
 *
 * Adds clickable images to a wrapper element, scrolls between them with buttons,
 * and centers the active image.
 *
 * @function renderCarousel
 * @param {Array<Object>} listings - Array of listing objects, each with an optional media array.
 *
 * @example
 * renderCarousel([
 *   { id: "abc123", title: "Sofa", media: [{ url: "https://..." }] },
 *   { id: "def456", title: "Chair", media: [{ url: "https://..." }] }
 * ]);
 */

export function renderCarousel(listings) {
  const wrapper = document.querySelector("#customCarouselWrapper");
  if (!wrapper || !listings.length) return;

  wrapper.innerHTML = "";

  listings.forEach((listing) => {
    const imageUrl =
      listing.media?.[0]?.url || "https://via.placeholder.com/800x400?text=No+Image";

    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.innerHTML = `
      <a href="/pages/auctionDetail.html?id=${listing.id}">
        <img src="${imageUrl}" alt="${listing.title}" />
      </a>
    `;

    wrapper.appendChild(slide);
  });

  const slides = wrapper.querySelectorAll(".carousel-slide");
  let activeIndex = 1;

  function updateActiveSlide() {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === activeIndex);
    });

    const offset = slides[0].offsetWidth + 16; // slide width + gap
    wrapper.scrollTo({ left: activeIndex * offset, behavior: "smooth" });
  }

  document.getElementById("prevBtn")?.addEventListener("click", () => {
    if (activeIndex > 0) {
      activeIndex--;
      updateActiveSlide();
    }
  });

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    if (activeIndex < slides.length - 1) {
      activeIndex++;
      updateActiveSlide();
    }
  });

  updateActiveSlide(); // Initial render
}
