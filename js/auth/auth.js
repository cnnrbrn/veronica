//import { URL } from "../../constants/api.js"; // Endret sti om constants ligger et annet sted

//export async function register(user) {
//const url = `${URL}auth/register`;

//const options = {
//method: "POST",
//headers: {
//"Content-Type": "application/json",
//},
//body: JSON.stringify(user),
//};

//const response = await fetch(url, options);
//const json = await response.json();

//if (!response.ok) {
//throw new Error("Registration failed");
//}

//return json;
//}

// Handles API calls for login and registration
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from "../config/constants.js";
import { storeInLocalStorage } from "../utilities/localStorage.js";
import { API_KEY } from "../config/constants.js";

// ✅ Importer funksjonen som henter credits
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
    console.log("Starting login for:", email);

    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    console.log(" API response:", responseData); //slette?

    console.log("Received response data:", responseData);

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    // Retrieve token from the response (now from responseData.data.accessToken)
    const token = responseData.data?.accessToken;

    console.log("🛠 Extracted Token:", token); //slette?

    const username = responseData.data?.name;
    if (!token) {
      throw new Error("Did not receive token from the API");
    }

    console.log("Login successful! Received token:", token);

    // Save token, username, and email in localStorage
    storeInLocalStorage("accessToken", token);

    console.log(
      " Token lagret i localStorage:",
      localStorage.getItem("accessToken"),
    ); //slette?

    storeInLocalStorage("userEmail", email);
    storeInLocalStorage("username", username);

    // ✅ Hent credits etter login
    await fetchUserProfile(username); // ✅ Dette er nytt

    console.log("Token, username, and email saved in localStorage.");

    // Redirect to the feed page
    window.location.href = "index.html"; //stoppe midlertidig
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
    console.log("Starting registration for:", userData.email);

    const response = await fetch(REGISTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    console.log("Received response data:", responseData);

    if (!response.ok) {
      console.error(` Registration failed with status ${response.status}`);
      console.error(
        " API error message:",
        JSON.stringify(responseData.errors, null, 2),
      );
      throw new Error(`Registration failed with status ${response.status}`);
    }

    console.log("Registration successful! User created:", responseData);

    // ✅ Hent credits etter registrering
    await fetchUserProfile(userData.name); // ✅ Dette er nytt

    console.log(
      `👤 New user: ${responseData.data.name} (${responseData.data.email})`,
    );

    // Redirect to the login page after registration
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
