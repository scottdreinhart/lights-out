/**
 * Test setup file for @games/farkle
 * Initializes Vitest environment with necessary test utilities
 */

import { afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllMocks()
})
