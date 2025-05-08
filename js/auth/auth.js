// Handles API calls for login and registration
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from "../config/constants.js";
import { storeInLocalStorage } from "../utilities/localStorage.js";
import { API_KEY } from "../config/constants.js";

// Import the function that retrieves credits
import { fetchUserProfile } from "../profile/profile.js";
/**
 * Logs in the user.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<void>}
 * @example
 * // Usage example:
 * loginUser('test123@stud.noroff.no', 'testPassword123')
 *     .then(() => console.log('User logged in successfully'))
 *     .catch(error => console.error('Login error:', error));
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    //  Retrieve token from responseData
    const token = responseData.data?.accessToken;
    const username = responseData.data?.name;

    if (!token) {
      throw new Error("Did not receive token from the API");
    }

    // Save token, username, and email in localStorage
    storeInLocalStorage("accessToken", token);
    storeInLocalStorage("userEmail", email);
    storeInLocalStorage("username", username);

    // Get credits after login
    await fetchUserProfile(username); 

    // Redirect to homepage after login
    window.location.href = "index.html"; 
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

/**
 * Registering a new user.
 * @param {Object} userData - Object with user data for registration.
 * @param {string} userData.name - The user's username.
 * @param {string} userData.email - The user's email address.
 * @param {string} userData.password - The user's password.
 * @returns {Promise<void>}
 * @example
 * // Usage example:
 * registerUser({
 *     name: 'john_doe',
 *     email: 'john.doe@stud.noroff.no',  // Valid email with @stud.noroff.no
 *     password: 'securePassword123'
 * })
 *     .then(() => console.log('User registered successfully'))
 *     .catch(error => console.error('Registration error:', error));
 */

export async function registerUser(userData) {
  try {
   
    const response = await fetch(REGISTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
  
    if (!response.ok) {
      throw new Error(`Registration failed with status ${response.status}`);
    }

    // Get credits after registration
    await fetchUserProfile(userData.name); 

    // Redirect to the login page after registration
    window.location.href = "index.html";
  } catch (error) {
    throw error;
  }
}
