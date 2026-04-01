/**
 * Storage Service — Persistent state via localStorage
 * 
 * Re-exports generic utilities from @games/storage-utils for consistency.
 * Provides: load, save, remove — all with error handling and type safety.
 */

// Re-export shared utilities with familiar names
export { loadWithFallback as load, loadNullable } from '@games/storage-utils'
export { saveJson as save, removeKey as remove } from '@games/storage-utils'
