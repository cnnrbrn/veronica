import { API_BASE_URL, API_KEY } from "../config/constants.js";
import { retrieveFromLocalStorage } from "../utilities/localStorage.js";
import { showLoadingIndicator, hideLoadingIndicator } from "../utilities/loader.js";

/**
 * Updates the user's profile (avatar and bio).
 *
 * - Retrieves access token and username from localStorage
 * - Collects form input values for avatar and bio
 * - Sends a PUT request to the API to update the profile
 * - Updates UI on success and shows feedback message
 * - Closes modal after success
 *
 * @async
 * @function updateProfile
 * @returns {Promise<void>}
 */

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

    // Update UI
    document.getElementById("profileAvatar").src = avatarUrl;
    document.getElementById("profileBio").textContent = bio;

    // Show success message
    const messageContainer = document.getElementById("profileUpdateMessage");
    messageContainer.innerHTML = `<div class="alert alert-success">Profile updated successfully!</div>`;

    // Hide modal after 1.5 sec and remove message
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

// Attach event listener to profile form submit
document.getElementById("editProfileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  updateProfile();
});

