import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";

export async function updateProfile() {
  const accessToken = retrieveFromLocalStorage("accessToken");
  const username = retrieveFromLocalStorage("username");
  const avatarInput = document.getElementById("editAvatarUrl").value.trim();
  const bio = document.getElementById("editBio").value.trim();

  // Get current image if no new one has been uploaded
  const currentAvatar = document.getElementById("profileAvatar").src;

  // If the user has entered a new URL, use it – otherwise keep the old one
  const avatarUrl = avatarInput !== "" ? avatarInput : currentAvatar;

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

    // Refresh the view in the UI
    document.getElementById("profileAvatar").src = avatarUrl;
    document.getElementById("profileBio").textContent = bio;
    
    const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
    modal.hide();

  } catch (error) {
    console.error(" Profile update failed:", error);
    alert("Failed to update profile: " + error.message);
  }
}

document.getElementById("editProfileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  updateProfile();
});
