import { loadWithFallback, removeKey, saveJson } from '@games/storage-utils'

export function load<T>(key: string, fallback: T): T {
  return loadWithFallback(key, fallback)
}

export function save<T>(key: string, value: T): void {
  saveJson(key, value)
}

export function remove(key: string): void {
  removeKey(key)
}
