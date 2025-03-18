import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/tests/e2e/**", "**/tests-examples/**"], // Ekskluder Playwright-testene
  },
});
