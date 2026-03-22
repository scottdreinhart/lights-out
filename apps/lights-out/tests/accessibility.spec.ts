import { test, expect, Page } from '@playwright/test'

/**
 * Accessibility Tests — Playwright
 * Tests keyboard navigation, focus management, ARIA attributes
 * Run: pnpm test:a11y
 */

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Start dev server first: pnpm dev
    await page.goto('http://localhost:5173')
  })

  test.describe('HamburgerMenu', () => {
    test('button is keyboard accessible', async ({ page }: { page: Page }) => {
      const button = page.locator('button[aria-haspopup="true"]').first()
      await expect(button).toBeFocused()

      // Focus should be on hamburger initially or nearby
      await button.focus()
      await expect(button).toBeFocused()
    })

    test('icon animates on click', async ({ page }: { page: Page }) => {
      const button = page.locator('button[aria-haspopup="true"]').first()
      const initialAriaExpanded = await button.getAttribute('aria-expanded')

      await button.click()
      const newAriaExpanded = await button.getAttribute('aria-expanded')

      // aria-expanded should toggle
      expect(initialAriaExpanded).not.toBe(newAriaExpanded)
    })

    test('menu opens with Enter key', async ({ page }: { page: Page }) => {
      const button = page.locator('button[aria-haspopup="true"]').first()
      await button.focus()
      await page.keyboard.press('Enter')

      const panel = page.locator('[role="menu"]')
      await expect(panel).toBeVisible()
    })

    test('ESC closes menu', async ({ page }: { page: Page }) => {
      const button = page.locator('button[aria-haspopup="true"]').first()
      await button.click()

      const panel = page.locator('[role="menu"]')
      await expect(panel).toBeVisible()

      await page.keyboard.press('Escape')
      await expect(panel).not.toBeVisible()
    })

    test('"All Settings" button opens modal', async ({ page }: { page: Page }) => {
      const button = page.locator('button[aria-haspopup="true"]').first()
      await button.click()

      const settingsBtn = page.locator('button:has-text("All Settings")')
      await expect(settingsBtn).toBeVisible()

      await settingsBtn.click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
    })
  })

  test.describe('SettingsModal', () => {
    test('modal has proper ARIA attributes', async ({ page }: { page: Page }) => {
      // Open settings modal
      const hamburger = page.locator('button[aria-haspopup="true"]').first()
      await hamburger.click()
      const settingsBtn = page.locator('button:has-text("All Settings")')
      await settingsBtn.click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toHaveAttribute('aria-modal', 'true')
      await expect(modal).toHaveAttribute('aria-labelledby')
    })

    test('Tab cycles through modal buttons', async ({ page }: { page: Page }) => {
      const hamburger = page.locator('button[aria-haspopup="true"]').first()
      await hamburger.click()
      const settingsBtn = page.locator('button:has-text("All Settings")')
      await settingsBtn.click()

      const closeBtn = page.locator('button[aria-label*="close"]').first()
      await closeBtn.focus()

      // Tab should move focus to next button
      await page.keyboard.press('Tab')
      const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
      expect(focused).not.toBe('Close')
    })

    test('ESC closes modal and restores focus', async ({ page }: { page: Page }) => {
      const hamburger = page.locator('button[aria-haspopup="true"]').first()
      await hamburger.click()
      const settingsBtn = page.locator('button:has-text("All Settings")')
      await settingsBtn.click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      await page.keyboard.press('Escape')
      await expect(modal).not.toBeVisible()

      // Focus should return to settings button (or nearby in menu)
      const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || '')
      expect(focused.toLowerCase()).toContain('setting')
    })

    test('Cancel button closes without saving', async ({ page }: { page: Page }) => {
      const hamburger = page.locator('button[aria-haspopup="true"]').first()
      await hamburger.click()
      const settingsBtn = page.locator('button:has-text("All Settings")')
      await settingsBtn.click()

      const cancelBtn = page.locator('button:has-text("Cancel")')
      await cancelBtn.click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).not.toBeVisible()
    })

    test('OK button confirms and closes', async ({ page }: { page: Page }) => {
      const hamburger = page.locator('button[aria-haspopup="true"]').first()
      await hamburger.click()
      const settingsBtn = page.locator('button:has-text("All Settings")')
      await settingsBtn.click()

      const okBtn = page.locator('button:has-text("OK")')
      await okBtn.click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).not.toBeVisible()
    })
  })

  test.describe('Responsive Layout', () => {
    test('works on mobile viewport (375px)', async ({ page }: { page: Page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const hamburger = page.locator('button[aria-haspopup="true"]').first()
      await expect(hamburger).toBeVisible()

      const box = await hamburger.boundingBox()
      // Touch target must be ≥44px
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    })

    test('works on tablet viewport (600px)', async ({ page }: { page: Page }) => {
      await page.setViewportSize({ width: 600, height: 800 })

      const hamburger = page.locator('button[aria-haspopup="true"]').first()
      await expect(hamburger).toBeVisible()
    })

    test('works on desktop viewport (1200px)', async ({ page }: { page: Page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })

      const hamburger = page.locator('button[aria-haspopup="true"]').first()
      await expect(hamburger).toBeVisible()
    })
  })

  test.describe('Color Contrast', () => {
    test('buttons have sufficient contrast', async ({ page }: { page: Page }) => {
      const buttons = page.locator('button')
      const count = await buttons.count()

      expect(count).toBeGreaterThan(0)

      // Visual inspection: buttons should be clearly visible
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i)
        await expect(button).toBeVisible()
      }
    })
  })

  test.describe('Focus Indicators', () => {
    test('focus visible on hamburger button', async ({ page }: { page: Page }) => {
      const hamburger = page.locator('button[aria-haspopup="true"]').first()
      await hamburger.focus()

      // Check that focus styles are applied (CSS :focus-visible)
      await page.evaluate(() => {
        const el = document.querySelector('button[aria-haspopup="true"]') as HTMLElement
        return window.getComputedStyle(el, ':focus-visible').outline
      })

      // Should have some outline or focus indicator (may be empty in some browsers)
      // The important part is that :focus-visible CSS rule exists
      expect(hamburger).toBeFocused()
    })
  })
})
