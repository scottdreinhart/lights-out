/**
 * Storage Service — Persistent state via localStorage
 *
 * Re-exports generic utilities from @games/storage-utils for consistency.
 * Provides: load, save, remove — all with error handling and type safety.
 */

// Re-export shared utilities with familiar names
export {
  loadWithFallback as load,
  loadNullable,
  removeKey as remove,
  saveJson as save,
} from '@games/storage-utils'
