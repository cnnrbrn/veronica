// Handles saving to and retrieving from localStorage
// Save data to localStorage

export function storeInLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve data from localStorage
export function retrieveFromLocalStorage(key) {
  return localStorage.getItem(key);
}

// Clear specific keys from localStorage
export function clearLocalStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userEmail");
  console.log("All user data cleared from localStorage.");
}
