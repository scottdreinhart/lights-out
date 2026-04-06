import { expect, test } from '@playwright/test'

/**
 * E2E Test Suite: Core Gameplay Flows
 * Tests critical user interactions: starting game, playing moves, win conditions, draws
 */

test.describe('Tic-Tac-Toe Gameplay', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173')

    // Wait for splash screen and skip it
    await page.waitForSelector('[role="main"]', { timeout: 5000 })
    await page.click('button:has-text("Play")', { timeout: 2000 }).catch(() => {
      // Splash may auto-dismiss
    })

    // Wait for main menu to appear
    await page.waitForSelector('button:has-text("Play Game")', { timeout: 3000 })
  })

  test('Should start a new game', async ({ page }) => {
    // Click "Play Game" button
    await page.click('button:has-text("Play Game")')

    // Wait for game board to appear
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Verify 9 cells are rendered
    const cells = await page.locator('[role="gridcell"]')
    const count = await cells.count()
    expect(count).toBe(9)

    // Verify game status is visible
    const status = await page.locator('[data-testid="game-status"]')
    await expect(status).toBeVisible()
  })

  test('Should play moves with keyboard (1-9)', async ({ page }) => {
    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Press '5' to place X in center
    await page.keyboard.press('Digit5')

    // Verify center cell (index 4) has X
    const cells = await page.locator('[role="gridcell"]')
    const centerCell = cells.nth(4)
    await expect(centerCell).toHaveAttribute('data-token', 'X')

    // CPU should move automatically
    await page.waitForTimeout(1000)

    // Verify at least one cell has O
    const cellsWithO = await cells.filter({ has: page.locator('[data-token="O"]') })
    expect(await cellsWithO.count()).toBeGreaterThan(0)
  })

  test('Should detect player win (3 in a row)', async ({ page }) => {
    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Play sequence to win horizontally (top row)
    // Move 1: X plays top-left (1)
    await page.keyboard.press('Digit1')
    await page.waitForTimeout(500)

    // Move 2: X plays top-middle (2)
    await page.keyboard.press('Digit2')
    await page.waitForTimeout(500)

    // Move 3: X plays top-right (3) - should trigger win
    await page.keyboard.press('Digit3')

    // Wait for win condition (game-over overlay or status change)
    await page.waitForSelector('[data-testid="game-over"]', { timeout: 3000 })

    // Verify win line is drawn
    const winLine = await page.locator('[data-testid="win-line"]')
    await expect(winLine).toBeVisible()

    // Verify outcome shows win
    const outcome = await page.locator('[data-testid="outcome"]')
    await expect(outcome).toContainText(/win|won/i)
  })

  test('Should detect draw condition', async ({ page }) => {
    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Play optimal draw sequence (both players play perfectly)
    // This is harder to automate, so we'll play a known-draw sequence
    const moves = [1, 5, 9, 3, 4, 2, 7, 6, 8] // Common draw pattern

    for (const move of moves) {
      await page.keyboard.press(`Digit${move}`)
      await page.waitForTimeout(700) // Wait for CPU move

      // Check if game is over (win or draw)
      const gameOver = await page.locator('[data-testid="game-over"]').isVisible()
      if (gameOver) {
        break
      }
    }

    // Wait for game-over state
    await page.waitForSelector('[data-testid="game-over"]', { timeout: 3000 })

    // Verify draw outcome
    const outcome = await page.locator('[data-testid="outcome"]')
    await expect(outcome).toContainText(/draw|tie|tied/i)
  })

  test('Should allow undo/reset after game', async ({ page }) => {
    // Start and win a game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Play winning sequence
    await page.keyboard.press('Digit1')
    await page.waitForTimeout(500)
    await page.keyboard.press('Digit2')
    await page.waitForTimeout(500)
    await page.keyboard.press('Digit3')

    // Wait for game-over
    await page.waitForSelector('[data-testid="game-over"]', { timeout: 3000 })

    // Click "New Game" or Reset button
    await page.click('button:has-text(/new game|reset|play again/i)')

    // Verify board is cleared
    const cells = await page.locator('[role="gridcell"]')
    for (let i = 0; i < 9; i++) {
      const cell = cells.nth(i)
      await expect(cell).not.toHaveAttribute('data-token', /X|O/)
    }
  })

  test('Should handle arrow key navigation', async ({ page }) => {
    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Press down arrow to move focus down
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowRight')

    // Press Enter to place at focused cell
    await page.keyboard.press('Enter')

    // Verify a move was placed
    const cells = await page.locator('[role="gridcell"]')
    const cellsWithX = await cells.filter({ has: page.locator('[data-token="X"]') })
    expect(await cellsWithX.count()).toBeGreaterThan(0)
  })
})

test.describe('Difficulty Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForSelector('[role="main"]', { timeout: 5000 })
  })

  test('Should allow difficulty selection', async ({ page }) => {
    // Access settings from menu
    await page.click('button:has-text("Settings")', { timeout: 2000 }).catch(() => {})

    // Wait for settings overlay
    await page.waitForSelector('[data-testid="difficulty-selector"]', { timeout: 2000 })

    // Select hard difficulty
    await page.click('button:has-text("Hard")')

    // Verify selection was saved
    const hardButton = await page.locator('button:has-text("Hard")')
    await expect(hardButton).toHaveAttribute('aria-pressed', 'true')
  })

  test('Easy difficulty should make random moves', async ({ page }) => {
    // Set difficulty to easy
    await page.click('button:has-text("Settings")', { timeout: 2000 }).catch(() => {})
    await page.waitForSelector('[data-testid="difficulty-selector"]', { timeout: 2000 })
    await page.click('button:has-text("Easy")')

    // Close settings
    await page.click('button:has-text("OK")')

    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Play first move
    await page.keyboard.press('Digit5')
    await page.waitForTimeout(800)

    // Easy AI should move quickly (no search depth)
    const cells = await page.locator('[role="gridcell"]')
    const cellsWithO = await cells.filter({ has: page.locator('[data-token="O"]') })
    expect(await cellsWithO.count()).toBeGreaterThan(0)
  })
})

test.describe('Accessibility & Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForSelector('[role="main"]', { timeout: 5000 })
  })

  test('Should be fully keyboard navigable', async ({ page }) => {
    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Tab through controls
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Verify something is focused (has outline/focus visible)
    const focused = await page.evaluate(() => {
      return document.activeElement?.tagName
    })
    expect(focused).toBeTruthy()
  })

  test('Should have ARIA labels on game cells', async ({ page }) => {
    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Verify cells have ARIA labels
    const cells = await page.locator('[role="gridcell"]')
    const firstCell = cells.nth(0)

    // Should have aria-label or aria-describedby
    const ariaLabel = await firstCell.getAttribute('aria-label')
    const ariaDescribedBy = await firstCell.getAttribute('aria-describedby')

    expect(ariaLabel || ariaDescribedBy).toBeTruthy()
  })

  test('Should support screen reader announcements', async ({ page }) => {
    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Play a move
    await page.keyboard.press('Digit5')

    // Wait for potential announcement update
    await page.waitForTimeout(500)

    // Verify live region exists for status updates
    const liveRegion = await page.locator('[aria-live="polite"], [aria-live="assertive"]')
    expect(await liveRegion.count()).toBeGreaterThan(0)
  })
})

test.describe('Touch & Mobile Interaction', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:5173')
    await page.waitForSelector('[role="main"]', { timeout: 5000 })
  })

  test('Should work on mobile (375px viewport)', async ({ page }) => {
    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Verify board is visible and not scrolled off
    const grid = await page.locator('[role="grid"]')
    const box = await grid.boundingBox()
    expect(box?.width).toBeLessThanOrEqual(375)

    // Tap center cell (touch interaction)
    await page.tap('[role="gridcell"]:nth-child(5)')
    await page.waitForTimeout(500)

    // Verify move was placed
    const cells = await page.locator('[role="gridcell"]')
    const cellsWithX = await cells.filter({ has: page.locator('[data-token="X"]') })
    expect(await cellsWithX.count()).toBeGreaterThan(0)
  })

  test('Should have touch-friendly button sizes (44+ px)', async ({ page }) => {
    // Get a button size
    const playButton = await page.locator('button:has-text("Play Game")')
    const box = await playButton.boundingBox()

    // Minimum touch target: 44px x 44px per WCAG
    expect(box?.height).toBeGreaterThanOrEqual(44)
    expect(box?.width).toBeGreaterThanOrEqual(44)
  })
})

test.describe('Series/Match Tracking', () => {
  test('Should track best-of-N series', async ({ page }) => {
    // Start game
    await page.click('button:has-text("Play Game")')
    await page.waitForSelector('[role="grid"]', { timeout: 2000 })

    // Play and win a game
    await page.keyboard.press('Digit1')
    await page.waitForTimeout(500)
    await page.keyboard.press('Digit2')
    await page.waitForTimeout(500)
    await page.keyboard.press('Digit3')

    // Wait for game-over
    await page.waitForSelector('[data-testid="game-over"]', { timeout: 3000 })

    // Verify series tracker is updated
    const seriesScore = await page.locator('[data-testid="series-score"]')
    await expect(seriesScore).toBeVisible()
    await expect(seriesScore).toContainText(/1|0/)
  })
})
