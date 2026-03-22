/**
 * Persistent Storage Service
 * Platform-agnostic JSON storage wrapper
 *
 * Provides both sync (for React hooks) and async (for platform abstraction) APIs
 */

import { resolvePlatformApi } from '../platform/resolvePlatformApi'

/**
 * Load a JSON value from persistent storage (SYNCHRONOUS)
 * Returns fallback if not found or parse fails
 *
 * Safe to use in React initializers and hooks
 */
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/**
 * Save a JSON value to persistent storage (SYNCHRONOUS)
 *
 * Safe to use in React callbacks and effects
 */
export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable — fail silently
  }
}

/**
 * Remove a key from persistent storage (SYNCHRONOUS)
 */
export function remove(key: string): void {
  localStorage.removeItem(key)
}

/**
 * Clear all persistent storage (SYNCHRONOUS)
 */
export function clear(): void {
  localStorage.clear()
}

// ──── Async versions (for platform abstraction) ────

/**
 * Load a JSON value asynchronously via PlatformApi
 */
export async function loadAsync<T>(key: string, fallback: T): Promise<T> {
  try {
    const platform = resolvePlatformApi()
    const raw = await platform.storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/**
 * Save a JSON value asynchronously via PlatformApi
 */
export async function saveAsync<T>(key: string, value: T): Promise<void> {
  try {
    const platform = resolvePlatformApi()
    await platform.storage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable — fail silently
  }
}

/**
 * Remove a key asynchronously via PlatformApi
 */
export async function removeAsync(key: string): Promise<void> {
  try {
    const platform = resolvePlatformApi()
    await platform.storage.removeItem(key)
  } catch {
    // Ignore errors
  }
}

/**
 * Clear storage asynchronously via PlatformApi
 */
export async function clearAsync(): Promise<void> {
  try {
    const platform = resolvePlatformApi()
    await platform.storage.clear()
  } catch {
    // Ignore errors
  }
}
