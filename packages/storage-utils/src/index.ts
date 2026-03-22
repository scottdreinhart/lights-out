export const loadWithFallback = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const loadNullable = <T>(key: string, fallback: T | null = null): T | null => {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const saveJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable */
  }
}

export const removeKey = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch {
    /* storage unavailable */
  }
}
