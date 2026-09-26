import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 4,
  use: { baseURL: "http://localhost:6006" },
  webServer: {
    command: "npm run storybook -- --ci --no-open",
    url: "http://localhost:6006",
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
