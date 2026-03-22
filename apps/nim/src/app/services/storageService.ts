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
 */

import type { GameState, GameStats, ThemeSettings } from '@/domain'

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
    if (!isLocalStorageAvailable()) return

    try {
      localStorage.setItem(KEYS.GAME_STATE, JSON.stringify(state))
    } catch (e) {
      // Quota exceeded or other error; silently fail
      console.debug('[Storage] Failed to save game state:', e)
    }
  },

  /**
   * Load saved game state.
   * Returns null if no saved state (new game).
   */
  loadGameState(): GameState | null {
    if (!isLocalStorageAvailable()) return null

    try {
      const raw = localStorage.getItem(KEYS.GAME_STATE)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error('[Storage] Failed to parse game state:', e)
      return null
    }
  },

  /**
   * Clear saved game state (when starting fresh).
   */
  clearGameState(): void {
    if (!isLocalStorageAvailable()) return

    try {
      localStorage.removeItem(KEYS.GAME_STATE)
    } catch (e) {
      console.debug('[Storage] Failed to clear game state:', e)
    }
  },

  /**
   * Save player statistics (wins, losses, streaks).
   * Called after each game result.
   */
  saveGameStats(stats: GameStats): void {
    if (!isLocalStorageAvailable()) return

    try {
      localStorage.setItem(KEYS.GAME_STATS, JSON.stringify(stats))
    } catch (e) {
      console.debug('[Storage] Failed to save game stats:', e)
    }
  },

  /**
   * Load player statistics.
   * Returns null if no stats yet.
   */
  loadGameStats(): GameStats | null {
    if (!isLocalStorageAvailable()) return null

    try {
      const raw = localStorage.getItem(KEYS.GAME_STATS)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error('[Storage] Failed to parse game stats:', e)
      return null
    }
  },

  /**
   * Save theme settings (color theme, colorblind mode, etc).
   * Called when theme preference changes.
   */
  saveThemeSettings(settings: ThemeSettings): void {
    if (!isLocalStorageAvailable()) return

    try {
      localStorage.setItem(KEYS.THEME_SETTINGS, JSON.stringify(settings))
    } catch (e) {
      console.debug('[Storage] Failed to save theme settings:', e)
    }
  },

  /**
   * Load theme settings.
   * Returns null if no settings saved (use defaults).
   */
  loadThemeSettings(): ThemeSettings | null {
    if (!isLocalStorageAvailable()) return null

    try {
      const raw = localStorage.getItem(KEYS.THEME_SETTINGS)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error('[Storage] Failed to parse theme settings:', e)
      return null
    }
  },

  /**
   * Enable/disable sound preference.
   */
  setSoundEnabled(enabled: boolean): void {
    if (!isLocalStorageAvailable()) return

    try {
      localStorage.setItem(KEYS.SOUND_ENABLED, JSON.stringify(enabled))
    } catch (e) {
      console.debug('[Storage] Failed to save sound setting:', e)
    }
  },

  /**
   * Check if sound is enabled (default: true).
   */
  isSoundEnabled(): boolean {
    if (!isLocalStorageAvailable()) return true

    try {
      const raw = localStorage.getItem(KEYS.SOUND_ENABLED)
      return raw !== null ? JSON.parse(raw) : true
    } catch (e) {
      console.debug('[Storage] Failed to load sound setting:', e)
      return true
    }
  },

  /**
   * Set language preference.
   */
  setLanguage(lang: 'en' | 'es'): void {
    if (!isLocalStorageAvailable()) return

    try {
      localStorage.setItem(KEYS.LANGUAGE, JSON.stringify(lang))
    } catch (e) {
      console.debug('[Storage] Failed to save language:', e)
    }
  },

  /**
   * Get language preference (default: 'en').
   */
  getLanguage(): 'en' | 'es' {
    if (!isLocalStorageAvailable()) return 'en'

    try {
      const raw = localStorage.getItem(KEYS.LANGUAGE)
      return raw ? JSON.parse(raw) : 'en'
    } catch (e) {
      console.debug('[Storage] Failed to load language:', e)
      return 'en'
    }
  },

  /**
   * Clear all persistent data (logout, reset, or factory reset).
   * Called when user explicitly resets app.
   */
  clearAll(): void {
    if (!isLocalStorageAvailable()) return

    try {
      Object.values(KEYS).forEach(key => localStorage.removeItem(key))
      console.log('[Storage] All data cleared')
    } catch (e) {
      console.error('[Storage] Failed to clear all data:', e)
    }
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
