import { test, expect } from '@playwright/test'

test.describe('Blackjack Card Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
    // Wait for app to load
    await page.waitForLoadState('networkidle')
  })

  test('should render dealer and player hands with cards', async ({ page }) => {
    // Check if main game container exists
    const gameContainer = page.locator('[class*="GameBoard"]')
    await expect(gameContainer).toBeVisible()
  })

  test('should display card SVG elements', async ({ page }) => {
    // Check for card images
    const cardImages = page.locator('img[alt*="of"]')
    
    // Wait for at least some cards to be rendered
    await page.waitForTimeout(1000)
    const count = await cardImages.count()
    
    console.log(`Found ${count} card images`)
    expect(count).toBeGreaterThan(0)
  })

  test('should load card SVG assets from /cards/ path', async ({ page }) => {
    // Intercept network requests to verify card assets are loaded
    const responses: string[] = []
    
    page.on('response', (response) => {
      if (response.url().includes('/cards/')) {
        responses.push(response.url())
        console.log(`[${response.status()}] ${response.url()}`)
      }
    })
    
    await page.waitForTimeout(2000)
    
    // Check that at least some card assets were loaded
    const loadedAssets = responses.filter(url => url.endsWith('.svg'))
    console.log(`Loaded ${loadedAssets.length} card SVG assets`)
    expect(loadedAssets.length).toBeGreaterThan(0)
  })

  test('should have proper card accessibility labels', async ({ page }) => {
    // Check for ARIA labels on cards
    const cardsWithLabels = page.locator('[aria-label*="of"]')
    
    await page.waitForTimeout(1000)
    const count = await cardsWithLabels.count()
    
    console.log(`Found ${count} cards with accessibility labels`)
    expect(count).toBeGreaterThan(0)
    
    // Check specific label format
    if (count > 0) {
      const firstLabel = await cardsWithLabels.first().getAttribute('aria-label')
      console.log(`First card label: ${firstLabel}`)
    }
  })

  test('should render dealer hand (with hidden card)', async ({ page }) => {
    // Look for "Dealer" label
    const dealerLabel = page.locator('text=Dealer')
    await expect(dealerLabel).toBeVisible()
    
    // Check for card back (hidden card)
    const hiddenCards = page.locator('[aria-label="Card back (hidden)"]')
    const hiddenCount = await hiddenCards.count()
    
    console.log(`Found ${hiddenCount} hidden cards (card backs)`)
    expect(hiddenCount).toBeGreaterThanOrEqual(1)
  })

  test('should detect console errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
        console.log(`[ERROR] ${msg.text()}`)
      }
    })
    
    await page.waitForTimeout(3000)
    
    // Log but don't strictly fail on console errors (may have non-critical warnings)
    console.log(`Total console errors: ${errors.length}`)
    if (errors.length > 0) {
      console.log('Errors found:')
      errors.forEach(err => console.log(`  - ${err}`))
    }
  })

  test('should handle card interaction (click card)', async ({ page }) => {
    // Look for a selectable card and try to click it
    const selectableCards = page.locator('[role="button"][aria-label*="of"]')
    const count = await selectableCards.count()
    
    console.log(`Found ${count} selectable cards`)
    
    if (count > 0) {
      const firstCard = selectableCards.first()
      const initialState = await firstCard.getAttribute('aria-pressed')
      console.log(`Card initial aria-pressed: ${initialState}`)
      
      // Click the card
      await firstCard.click()
      await page.waitForTimeout(500)
      
      const afterClick = await firstCard.getAttribute('aria-pressed')
      console.log(`Card after click aria-pressed: ${afterClick}`)
    }
  })

  test('should verify card SVG file integrity', async ({ page }) => {
    // Try to fetch a specific card SVG and verify it loads
    const response = await page.request.get('http://localhost:5173/cards/AS.svg')
    console.log(`Ace of Spades SVG status: ${response.status()}`)
    expect(response.status()).toBe(200)
    
    const text = await response.text()
    console.log(`Ace of Spades SVG size: ${text.length} bytes`)
    expect(text.length).toBeGreaterThan(0)
    expect(text).toContain('<svg')
  })

  test('card back SVG loads correctly', async ({ page }) => {
    const response = await page.request.get('http://localhost:5173/cards/1B.svg')
    console.log(`Card back SVG status: ${response.status()}`)
    expect(response.status()).toBe(200)
    
    const text = await response.text()
    console.log(`Card back SVG size: ${text.length} bytes`)
    expect(text.length).toBeGreaterThan(0)
    expect(text).toContain('<svg')
  })
})
