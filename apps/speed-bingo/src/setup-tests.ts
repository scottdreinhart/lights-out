// Setup file for unit tests (node environment)
// For constant/utility tests, no React DOM cleanup needed

import { afterAll, beforeAll } from 'vitest'

// Suppress ReactDOM warnings if they occur
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render')) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
