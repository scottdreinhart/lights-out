/**
 * Test setup file for @games/blackjack
 * Initializes Vitest environment with necessary test utilities
 */

import { afterEach, vi } from 'vitest'

// Mock window/DOM elements if needed
beforeAll(() => {
  // Setup any global test fixtures
})

afterEach(() => {
  // Clean up after each test
  vi.clearAllMocks()
})
