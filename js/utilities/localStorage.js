/**
 * Stores a key-value pair in localStorage.
 *
 * @function storeInLocalStorage
 * @param {string} key - The key under which to store the value.
 * @param {string} value - The value to store.
 */
export function storeInLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

/**
 * Retrieves a value from localStorage by its key.
 *
 * @function retrieveFromLocalStorage
 * @param {string} key - The key of the value to retrieve.
 * @returns {string|null} The retrieved value, or null if not found.
 */

export function retrieveFromLocalStorage(key) {
  return localStorage.getItem(key);
}

/**
 * Clears specific user-related data from localStorage.
 *
 * @function clearLocalStorage
 * @returns {void}
 */

export function clearLocalStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userEmail");
}
