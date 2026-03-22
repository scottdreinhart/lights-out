/**
 * useLocalStorage — Typed localStorage hook with fallback.
 *
 * Usage:
 *   const [count, setCount] = useLocalStorage('myCount', 0)
 *
 *   // Automatically persists to localStorage on every change
 *   // Survives app reload
 */

import { useCallback, useState } from 'react'

import { load, remove, save } from '@/infrastructure/storage'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      return load<T>(key, initialValue)
    } catch {
      console.warn(`[useLocalStorage] Failed to load ${key}, using fallback`)
      return initialValue
    }
  })

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value)
        save(key, value)
      } catch {
        console.warn(`[useLocalStorage] Failed to save ${key}`)
      }
    },
    [key],
  )

  // Clear the stored value
  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      remove(key)
    } catch {
      console.warn(`[useLocalStorage] Failed to clear ${key}`)
    }
  }, [key, initialValue])

  return [storedValue, setValue, clearValue]
}
