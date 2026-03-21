const path = require('path')
const { defineConfig, devices } = require('@playwright/test')

const backendDir = path.join(__dirname, '..', 'blogilista-backend')
//localhost changet to straight IP because for some reason the Playwirght didint work with localhost due to my windows and dropbox configurations
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'node start-test-env.cjs',
    cwd: __dirname,
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
