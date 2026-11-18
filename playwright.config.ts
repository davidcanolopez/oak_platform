import { defineConfig, devices } from "@playwright/test";

export const REFERENCE_VIEWPORTS = {
  mobileSmall: { width: 320, height: 568 },
  mobileStandard: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktopMinimum: { width: 1200, height: 800 },
  desktopMain: { width: 1440, height: 900 },
} as const;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "reports/e2e/results.json" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    locale: "es-ES",
    timezoneId: "Europe/Madrid",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: REFERENCE_VIEWPORTS.desktopMain,
      },
    },
    {
      name: "chromium-desktop-min",
      use: {
        ...devices["Desktop Chrome"],
        viewport: REFERENCE_VIEWPORTS.desktopMinimum,
      },
    },
    {
      name: "chromium-tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: REFERENCE_VIEWPORTS.tablet,
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 7"],
        viewport: REFERENCE_VIEWPORTS.mobileStandard,
      },
    },
    {
      name: "chromium-mobile-320",
      use: {
        ...devices["Pixel 7"],
        viewport: REFERENCE_VIEWPORTS.mobileSmall,
      },
    },
    {
      name: "firefox-desktop",
      use: {
        ...devices["Desktop Firefox"],
        viewport: REFERENCE_VIEWPORTS.desktopMain,
      },
    },
    {
      name: "webkit-desktop",
      use: {
        ...devices["Desktop Safari"],
        viewport: REFERENCE_VIEWPORTS.desktopMain,
      },
    },
    {
      name: "webkit-mobile",
      use: {
        ...devices["iPhone 14"],
        viewport: REFERENCE_VIEWPORTS.mobileStandard,
      },
    },
  ],
});
