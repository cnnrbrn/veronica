import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { showLoadingIndicator, hideLoadingIndicator } from "../utilities/loader.js";

export async function updateProfile() {
  const accessToken = retrieveFromLocalStorage("accessToken");
  const username = retrieveFromLocalStorage("username");
  const avatarInput = document.getElementById("editAvatarUrl").value.trim();
  const bio = document.getElementById("editBio").value.trim();

  const currentAvatar = document.getElementById("profileAvatar").src;
  const avatarUrl = avatarInput !== "" ? avatarInput : currentAvatar;

  showLoadingIndicator();

  try {
    const response = await fetch(`${API_BASE_URL}/auction/profiles/${username}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({
        avatar: {
          url: avatarUrl,
          alt: username,
        },
        bio: bio,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Could not update profile.");
    }

    // ✅ Oppdater UI
    document.getElementById("profileAvatar").src = avatarUrl;
    document.getElementById("profileBio").textContent = bio;

    // ✅ Vis suksessmelding
    const messageContainer = document.getElementById("createAuctionMessage");
    messageContainer.innerHTML = `<div class="alert alert-success">Profile updated successfully!</div>`;

    // ✅ Skjul modal etter 1.5 sek og fjern melding
    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
      modal.hide();
      messageContainer.innerHTML = "";
    }, 1500);

  } catch (error) {
    console.error(" Profile update failed:", error);
    alert("Failed to update profile: " + error.message);
  } finally {
    hideLoadingIndicator();
  }
}

document.getElementById("editProfileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  updateProfile();
});

