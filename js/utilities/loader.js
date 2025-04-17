export function showLoadingIndicator() {
    console.log("Displaying loading indicator");
  
    // Check if it already exists to avoid multiple
    if (document.getElementById("loading-indicator")) return;
  
    const loader = document.createElement("div");
    loader.id = "loading-indicator";
    loader.innerHTML = `
      <div class="spinner-overlay">
        <div class="spinner"></div>
      </div>
    `;
    document.body.appendChild(loader);
    console.log("The loading indicator was added to the DOM");
  }
  
  export function hideLoadingIndicator() {
    console.log("Hiding loading indicator");
  
    const loader = document.getElementById("loading-indicator");
    if (loader) {
      document.body.removeChild(loader);
    }
  }
  