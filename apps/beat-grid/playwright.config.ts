import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration with 2026 Device Profiles
 * 
 * Includes popular devices from Chrome DevTools as of 2026:
 * - iPhone 15 / 15 Pro (flagship iOS)
 * - Pixel 9 Pro (flagship Android)
 * - iPad Air (tablet iOS)
 * - Galaxy Tab S10 (tablet Android)
 * - Desktop (1080p, 1440p, 4K)
 * - Custom breakpoints (375, 600, 900, 1200, 1800px)
 */

export default defineConfig({
  testDir: './src/__tests__/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers + device profiles */
  projects: [
    {
      name: 'chromium-mobile-iphone15',
      use: {
        ...devices['iPhone 15'],
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'chromium-mobile-iphone15pro',
      use: {
        ...devices['iPhone 15 Pro'],
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'chromium-mobile-pixel9',
      use: {
        ...devices['Pixel 9 Pro'],
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'chromium-tablet-ipad',
      use: {
        ...devices['iPad Air'],
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'chromium-tablet-galaxytab',
      use: {
        ...devices['Galaxy Tab S4'],
        baseURL: 'http://localhost:5173',
      },
    },

    /* Desktop breakpoints (custom) */
    {
      name: 'chromium-desktop-1080p',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'chromium-desktop-1440p',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 2560, height: 1440 },
        baseURL: 'http://localhost:5173',
      },
    },

    /* Custom responsive breakpoints (matching CSS media queries) */
    {
      name: 'responsive-375-mobile',
      use: {
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'responsive-600-tablet',
      use: {
        viewport: { width: 600, height: 900 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'responsive-900-desktop',
      use: {
        viewport: { width: 900, height: 1080 },
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'responsive-1200-widescreen',
      use: {
        viewport: { width: 1200, height: 1440 },
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'responsive-1800-ultrawide',
      use: {
        viewport: { width: 1800, height: 1440 },
        baseURL: 'http://localhost:5173',
      },
    },

    /* Firefox on desktop */
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:5173',
      },
    },

    /* Safari on desktop */
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:5173',
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
