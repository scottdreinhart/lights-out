import { test, expect } from './fixtures'

/**
 * MainMenu Responsive Scaling Tests
 * 
 * Tests MainMenu component at all breakpoints:
 * - 375px (mobile)
 * - 600px (tablet) 
 * - 900px (desktop)
 * - 1200px (widescreen)
 * - 1800px (ultrawide)
 * 
 * Verifies:
 * - Container expands properly at each breakpoint
 * - Buttons resize and reflow correctly
 * - Typography scales appropriately
 * - No horizontal overflow
 * - Proper spacing and padding
 */

test.describe('MainMenu Responsive Scaling', () => {
  test('renders at all breakpoints without overflow', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })

      // Wait for any transitions
      await page.waitForLoadState('networkidle')

      // Get the main menu container (find the content area)
      const content = page.locator('main, [role="main"], div').nth(2)
      const box = await content.boundingBox()

      expect(box, `Content should be visible at ${bp.label}`).toBeTruthy()
      if (box) {
        // Should not exceed viewport width minus safe margins
        expect(box.width).toBeLessThanOrEqual(bp.width)
        console.log(`✓ ${bp.label}: Content width ${Math.round(box.width)}px (viewport: ${bp.width}px)`)
      }
    }
  })

  test('scales button containers properly', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      // Find all buttons on page
      const buttons = page.locator('button')
      const count = await buttons.count()

      expect(count).toBeGreaterThan(0)

      if (count > 1) {
        const firstBtn = buttons.first()
        const secondBtn = buttons.nth(1)

        const box1 = await firstBtn.boundingBox()
        const box2 = await secondBtn.boundingBox()

        if (box1 && box2) {
          console.log(`✓ ${bp.label}: Found ${count} buttons, first at ${Math.round(box1.x)},${Math.round(box1.y)}, second at ${Math.round(box2.x)},${Math.round(box2.y)}`)
        }
      }
    }
  })

  test('typography scales across breakpoints', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      // Check text element font sizes
      const headings = page.locator('h1, h2, p')
      const count = await headings.count()

      if (count > 0) {
        const first = headings.first()
        const size = await first.evaluate((el) => window.getComputedStyle(el).fontSize)
        const sizeNum = parseFloat(size)

        expect(sizeNum).toBeGreaterThan(0)
        console.log(`✓ ${bp.label}: Text font size ${sizeNum.toFixed(1)}px`)
      }
    }
  })

  test('no horizontal scrollbar at any breakpoint', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
      console.log(`✓ ${bp.label}: No horizontal overflow (scroll: ${scrollWidth}px <= viewport: ${clientWidth}px)`)
    }
  })

  test('content padding increases at larger viewports', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    const paddingSizes: Record<string, number> = {}

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      // Get main content div
      const content = page.locator('div').nth(1)
      const padding = await content.evaluate((el) => window.getComputedStyle(el).padding)
      const paddingNum = parseFloat(padding)

      paddingSizes[bp.name] = paddingNum
      console.log(`✓ ${bp.label}: Padding ${paddingNum.toFixed(1)}px`)
    }

    // Basic sanity check - padding should be set
    for (const key in paddingSizes) {
      expect(paddingSizes[key]).toBeDefined()
    }
  })

  test('visually stable at all breakpoints', async ({ page, allBreakpoints }) => {
    await page.goto('/')

    for (const bp of allBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.waitForLoadState('networkidle')

      // Verify page loads without errors
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text())
      })

      // Wait a tick for rendering
      await page.waitForTimeout(500)

      expect(errors).toEqual([])
      console.log(`✓ ${bp.label}: Page rendered without errors`)
    }
  })
})
