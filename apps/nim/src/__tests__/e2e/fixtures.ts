import { test as base, expect } from '@playwright/test'

/**
 * Custom test fixtures for responsive testing
 * Provides helpers for testing at different breakpoints
 */

type ResponsiveBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'widescreen' | 'ultrawide'

interface BreakpointInfo {
  name: string
  width: number
  height: number
  label: string
}

const breakpoints: Record<ResponsiveBreakpoint, BreakpointInfo> = {
  mobile: { name: 'mobile', width: 375, height: 812, label: '📱 375px (Mobile)' },
  tablet: { name: 'tablet', width: 600, height: 900, label: '📗 600px (Tablet)' },
  desktop: { name: 'desktop', width: 900, height: 1080, label: '🖥️ 900px (Desktop)' },
  widescreen: { name: 'widescreen', width: 1200, height: 1440, label: '🖥️ 1200px (Widescreen)' },
  ultrawide: { name: 'ultrawide', width: 1800, height: 1440, label: '🖥️ 1800px (Ultrawide)' },
}

type ResponsiveTestFixtures = {
  breakpoint: BreakpointInfo
  allBreakpoints: BreakpointInfo[]
  testAtBreakpoint: (breakpoint: ResponsiveBreakpoint) => Promise<void>
}

export const test = base.extend<ResponsiveTestFixtures>({
  breakpoint: async ({ page }, use) => {
    // Default to desktop
    const bp = breakpoints.desktop
    await page.setViewportSize({ width: bp.width, height: bp.height })
    await use(bp)
  },

  allBreakpoints: async ({}, use) => {
    await use(Object.values(breakpoints))
  },

  testAtBreakpoint: async ({ page }, use) => {
    const testFn = async (breakpoint: ResponsiveBreakpoint) => {
      const bp = breakpoints[breakpoint]
      if (!bp) throw new Error(`Unknown breakpoint: ${breakpoint}`)
      console.log(`Testing at ${bp.label}`)
      await page.setViewportSize({ width: bp.width, height: bp.height })
    }
    await use(testFn)
  },
})

export { expect }
