/**
 * useDebounce — Delay value updates to prevent excessive re-renders.
 *
 * Usage:
 *   const [searchInput, setSearchInput] = useState('')
 *   const debouncedSearch = useDebounce(searchInput, 300)
 *
 *   // debouncedSearch only updates after 300ms of inactivity
 *   useEffect(() => {
 *     performSearch(debouncedSearch)
 *   }, [debouncedSearch])
 */

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up timer to debounce value change
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    // Clean up timer if value changes before delay completes
    return () => {
      clearTimeout(handler)
    }
  }, [value, delayMs])

  return debouncedValue
}
