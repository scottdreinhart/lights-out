/**
 * Test setup file for @games/go-fish
 * Initializes Vitest environment with necessary test utilities
 */

import { afterEach, vi } from 'vitest'

afterEach(() => {
  // Clean up after each test
  vi.clearAllMocks()
})
