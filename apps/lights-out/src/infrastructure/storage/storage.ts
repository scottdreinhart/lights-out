/**
 * Storage infrastructure service for lights-out app
 * Provides low-level localStorage operations
 * Infrastructure layer - no dependencies on app or UI layers
 */

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

export function remove(key: string): void {
  localStorage.removeItem(key)
}

export const clear = (): void => {
  localStorage.clear()
}
