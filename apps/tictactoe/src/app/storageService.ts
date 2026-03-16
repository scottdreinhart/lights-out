export const load = <T>(key: string, fallback: T | null = null): T | null => {
  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) {
      return JSON.parse(raw) as T
    }
  } catch {
    /* corrupt JSON or storage unavailable */
  }
  return fallback
}

export const save = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — silently ignore */
  }
}

export const remove = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch {
    /* storage unavailable — silently ignore */
  }
}
