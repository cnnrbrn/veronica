import { API_KEY } from "../config/constants.js";

export async function fetchUserProfile(username) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("❌ Ingen token funnet, brukeren er ikke logget inn.");
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${username}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      },
    );

    const responseData = await response.json();
    const credits = responseData.data.credits;

    const creditsElement = document.querySelector("#credits");
    if (creditsElement) {
      creditsElement.textContent = `Credits: ${credits}`;
    }
  } catch (error) {
    console.error("Feil ved henting av profil:", error);
  }
}
