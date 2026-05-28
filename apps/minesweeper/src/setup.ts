/**
 * Test setup file for @games/minesweeper
 * Initializes Vitest environment with necessary test utilities
 */

import { afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllMocks()
})
