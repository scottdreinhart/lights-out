/**
 * Test setup file for @games/hangman
 * Initializes Vitest environment with necessary test utilities
 */

import { afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllMocks()
})
