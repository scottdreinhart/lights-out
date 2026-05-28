import { expect, test } from 'vitest'

test('test environment exposes localStorage mocks', () => {
  expect(window.localStorage).toBeDefined()
  expect(typeof window.localStorage.getItem).toBe('function')
})

test('test environment exposes matchMedia mock', () => {
  const result = window.matchMedia('(min-width: 900px)')
  expect(result.matches).toBe(false)
  expect(result.media).toBe('(min-width: 900px)')
})
