/**
 * Migration Test: storageService refactor to use @games/storage-utils
 * 
 * This file validates that the new re-export pattern works identically
 * to the original 27-line implementation.
 */

import { load, save, remove } from '@games/storage-utils'

describe('storageService migration', () => {
  const testKey = 'test:migration'
  const testData = { message: 'test' }

  beforeEach(() => {
    localStorage.clear()
  })

  it('should save to localStorage', () => {
    save(testKey, testData)
    expect(localStorage.getItem(testKey)).toBe(JSON.stringify(testData))
  })

  it('should load from localStorage', () => {
    localStorage.setItem(testKey, JSON.stringify(testData))
    const result = load(testKey, null)
    expect(result).toEqual(testData)
  })

  it('should return fallback on missing key', () => {
    const fallback = { default: true }
    const result = load(testKey, fallback)
    expect(result).toEqual(fallback)
  })

  it('should handle corrupted JSON gracefully', () => {
    localStorage.setItem(testKey, 'invalid json {')
    const fallback = { default: true }
    const result = load(testKey, fallback)
    expect(result).toEqual(fallback)
  })

  it('should remove from localStorage', () => {
    localStorage.setItem(testKey, JSON.stringify(testData))
    remove(testKey)
    expect(localStorage.getItem(testKey)).toBeNull()
  })

  it('should handle remove gracefully when key missing', () => {
    expect(() => remove('nonexistent')).not.toThrow()
  })
})
