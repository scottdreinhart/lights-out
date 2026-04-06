/**
 * Test setup file for @games/liars-dice
 * Initializes Vitest environment with necessary test utilities
 */

import { expect, afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllMocks()
})
