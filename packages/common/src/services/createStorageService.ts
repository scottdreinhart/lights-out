/**
 * Storage service factory — generic localStorage operations
 */
export function createStorageService() {
  return {
    load: (key: string): string | null => {
      if (typeof window === 'undefined') return null
      try {
        return window.localStorage.getItem(key)
      } catch {
        return null
      }
    },

    save: (key: string, value: string): void => {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.setItem(key, value)
      } catch {
        console.warn(`Failed to save to localStorage: ${key}`)
      }
    },

    remove: (key: string): void => {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.removeItem(key)
      } catch {
        console.warn(`Failed to remove from localStorage: ${key}`)
      }
    },

    clear: (): void => {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.clear()
      } catch {
        console.warn('Failed to clear localStorage')
      }
    },
  }
}
