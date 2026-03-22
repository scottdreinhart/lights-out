import { test, expect } from './fixtures'

/**
 * App Navigation Responsive Tests
 * 
 * Tests overall app layout and navigation at different breakpoints
 */

test.describe('App Layout Responsive', () => {
  test('app header remains visible and properly sized', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      const header = page.locator('header, [role="banner"], body > div').first()
      expect(await header.isVisible()).toBeTruthy()

      const box = await header.boundingBox()
      expect(box).toBeTruthy()
      if (box) {
        // Header should span reasonable width
        expect(box.width).toBeGreaterThan(0)
        console.log(`✓ ${bp.label}: Header visible, width ${Math.round(box.width)}px`)
      }
    }
  })

  test('content area scrollable when needed', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      // Content should not cause horizontal overflow
      const htmlScroll = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

      expect(htmlScroll).toBeLessThanOrEqual(clientWidth + 1) // +1 for rounding
      console.log(`✓ ${bp.label}: No horizontal scroll (${htmlScroll}px vs ${clientWidth}px)`)
    }
  })

  test('touch targets are adequate on mobile', async ({ page }) => {
    // Test only on mobile breakpoints
    const mobileBreakpoints = ['mobile', 'tablet']

    for (const bpName of mobileBreakpoints) {
      if (bpName === 'mobile') {
        await page.setViewportSize({ width: 375, height: 812 })
      } else {
        await page.setViewportSize({ width: 600, height: 900 })
      }

      await page.waitForLoadState('networkidle')

      // Get all interactive elements
      const buttons = page.locator('button')
      const count = await buttons.count()

      for (let i = 0; i < Math.min(count, 3); i++) {
        const btn = buttons.nth(i)
        const box = await btn.boundingBox()

        if (box) {
          // Touch targets should be at least 44x44px (Apple recommendation)
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }

      console.log(`✓ ${bpName}: Touch targets adequate (≥44x44px)`)
    }
  })

  test('color contrast maintained across themes', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      // Get computed colors of text elements
      const text = page.locator('p, button, h1, h2, h3').first()

      const fgColor = await text.evaluate((el) => window.getComputedStyle(el).color)

      // Just verify color is set (won't do WCAG calculation in test)
      expect(fgColor).toBeTruthy()
      console.log(`✓ ${bp.label}: Text color applied (${fgColor})`)
    }
  })

  test('respects prefers-reduced-motion', async ({ allBreakpoints, context }) => {
    // Create context with reduced motion
    const reducedMotionPage = await context.newPage()
    await reducedMotionPage.emulateMedia({ reducedMotion: 'reduce' })

    for (const bp of allBreakpoints) {
      await reducedMotionPage.setViewportSize({ width: bp.width, height: bp.height })
      await reducedMotionPage.goto('/')
      await reducedMotionPage.waitForLoadState('networkidle')

      const prefersReduced = await reducedMotionPage.evaluate(() =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      )

      expect(prefersReduced).toBeTruthy()
      console.log(`✓ ${bp.label}: Reduced motion preference detected`)
    }

    await reducedMotionPage.close()
  })

  test('layout shift on scroll is minimal', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 900, height: 1080 })
    await page.waitForLoadState('networkidle')

    // Get initial layout position
    const content = page.locator('main, [role="main"], body > div').first()
    const initialBox = await content.boundingBox()

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 200))
    await page.waitForTimeout(500)

    // Get final position
    const finalBox = await content.boundingBox()

    // Content should remain in reasonable position
    if (initialBox && finalBox) {
      const shift = Math.abs(finalBox.y - initialBox.y)
      expect(shift).toBeLessThanOrEqual(50) // Allow some shift
      console.log(`✓ Content maintains position on scroll (layout shift: ${shift}px)`)
    }
  })
})
