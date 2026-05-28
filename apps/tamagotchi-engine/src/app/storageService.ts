/**
 * Storage Service — Persistent state via localStorage.
 *
 * Reuses the shared storage service factory from @games/common.
 */

import { createStorageService } from '@games/common'

const storage = createStorageService()

export function load<T>(key: string, fallback: T | null = null): T | null {
  const raw = storage.load(key)

  if (raw === null) {
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown): void {
  storage.save(key, JSON.stringify(value))
}

export function remove(key: string): void {
  storage.remove(key)
}
