/**
 * Test setup file for @games/snakes-and-ladders
 * Initializes Vitest environment with necessary test utilities
 */

import { expect, afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllMocks()
})
