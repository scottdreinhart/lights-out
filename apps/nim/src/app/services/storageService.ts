/**
 * Storage Service — Persistent state management via localStorage.
 * Survives app suspension, network loss, and device restart.
 *
 * Handles:
 * - Game state persistence (resume in-progress games)
 * - Player statistics (wins/losses/streaks)
 * - User preferences (theme, sound, language)
 *
 * Error handling: Silently fails on quota exceeded (app continues without save).
 * Graceful degradation: If localStorage unavailable (private mode, etc.), app still works.
 *
 * Uses @games/storage-utils for centralized error handling and consistency.
 */

import type { GameState, GameStats, ThemeSettings } from '@/domain'
import { loadNullable, loadWithFallback, removeKey, saveJson } from '@games/storage-utils'

const KEYS = {
  GAME_STATE: 'nim:game:state',
  GAME_STATS: 'nim:stats:game',
  THEME_SETTINGS: 'nim:settings:theme',
  SOUND_ENABLED: 'nim:settings:sound.enabled',
  LANGUAGE: 'nim:settings:language',
} as const

/**
 * Check if localStorage is available (not in private mode, not quota exceeded).
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export const storageService = {
  /**
   * Save game state (full board + player info).
   * Called after every move to ensure recovery on app suspension.
   */
  saveGameState(state: GameState): void {
    if (!isLocalStorageAvailable()) {return}
    saveJson(KEYS.GAME_STATE, state)
  },

  /**
   * Load saved game state.
   * Returns null if no saved state (new game).
   */
  loadGameState(): GameState | null {
    if (!isLocalStorageAvailable()) {return null}
    return loadNullable<GameState>(KEYS.GAME_STATE)
  },

  /**
   * Clear saved game state (when starting fresh).
   */
  clearGameState(): void {
    if (!isLocalStorageAvailable()) {return}
    removeKey(KEYS.GAME_STATE)
  },

  /**
   * Save player statistics (wins, losses, streaks).
   * Called after each game result.
   */
  saveGameStats(stats: GameStats): void {
    if (!isLocalStorageAvailable()) {return}
    saveJson(KEYS.GAME_STATS, stats)
  },

  /**
   * Load player statistics.
   * Returns null if no stats yet.
   */
  loadGameStats(): GameStats | null {
    if (!isLocalStorageAvailable()) {return null}
    return loadNullable<GameStats>(KEYS.GAME_STATS)
  },

  /**
   * Save theme settings (color theme, colorblind mode, etc).
   * Called when theme preference changes.
   */
  saveThemeSettings(settings: ThemeSettings): void {
    if (!isLocalStorageAvailable()) {return}
    saveJson(KEYS.THEME_SETTINGS, settings)
  },

  /**
   * Load theme settings.
   * Returns null if no settings saved (use defaults).
   */
  loadThemeSettings(): ThemeSettings | null {
    if (!isLocalStorageAvailable()) {return null}
    return loadNullable<ThemeSettings>(KEYS.THEME_SETTINGS)
  },

  /**
   * Enable/disable sound preference.
   */
  setSoundEnabled(enabled: boolean): void {
    if (!isLocalStorageAvailable()) {return}
    saveJson(KEYS.SOUND_ENABLED, enabled)
  },

  /**
   * Check if sound is enabled (default: true).
   */
  isSoundEnabled(): boolean {
    if (!isLocalStorageAvailable()) {return true}
    return loadWithFallback<boolean>(KEYS.SOUND_ENABLED, true)
  },

  /**
   * Set language preference.
   */
  setLanguage(lang: 'en' | 'es'): void {
    if (!isLocalStorageAvailable()) {return}
    saveJson(KEYS.LANGUAGE, lang)
  },

  /**
   * Get language preference (default: 'en').
   */
  getLanguage(): 'en' | 'es' {
    if (!isLocalStorageAvailable()) {return 'en'}
    return loadWithFallback<'en' | 'es'>(KEYS.LANGUAGE, 'en')
  },

  /**
   * Clear all persistent data (logout, reset, or factory reset).
   * Called when user explicitly resets app.
   */
  clearAll(): void {
    if (!isLocalStorageAvailable()) {return}
    Object.values(KEYS).forEach(key => removeKey(key))
  },

  /**
   * Get total storage usage (debugging/monitoring).
   */
  getStorageUsage(): {
    used: number
    items: number
  } {
    if (!isLocalStorageAvailable()) {
      return { used: 0, items: 0 }
    }

    let totalSize = 0
    Object.values(KEYS).forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        totalSize += item.length + key.length
      }
    })

    return {
      used: totalSize,
      items: Object.keys(localStorage).length,
    }
  },
}
