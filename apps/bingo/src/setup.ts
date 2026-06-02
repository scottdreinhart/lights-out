/**
 * Test setup file for @games/bingo
 * Initializes Vitest environment with necessary test utilities
 */

import { afterEach, beforeAll, vi } from 'vitest'

// Mock window/DOM elements if needed
beforeAll(() => {
  // Setup any global test fixtures
})

afterEach(() => {
  // Clean up after each test
  vi.clearAllMocks()
})
