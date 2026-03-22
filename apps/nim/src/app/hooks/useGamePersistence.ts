/**
 * Cross-platform game persistence
 * Saves/loads game state to native storage (Capacitor), IndexedDB, or localStorage
 */

import { useCallback } from 'react'
import { usePlatform } from './usePlatform'
import { useCapacitorStorage } from './useCapacitor'
import type { GameState } from '@/domain'

interface GamePersistence {
  saveGame: (state: GameState) => Promise<void>
  loadGame: () => Promise<GameState | null>
  deleteGame: () => Promise<void>
}

const GAME_STATE_KEY = 'nim-game-state'

/**
 * useGamePersistence - Save/load game state across platforms
 *
 * - Capacitor (Android/iOS): Native Preferences storage
 * - Electron: localStorage (with fs fallback available via IPC)
 * - Web: localStorage + IndexedDB fallback
 *
 * Auto-saves game state on every render; can also be called manually
 */
export const useGamePersistence = (): GamePersistence => {
  const { isCapacitor, isElectron } = usePlatform()
  const capacitorStorage = useCapacitorStorage()

  // Electron IPC helpers (no-op if not Electron)
  const electronSave = useCallback(async (key: string, data: string) => {
    if (!isElectron) return
    try {
      const ipc = (window as any).electron?.ipcRenderer
      if (ipc) {
        await ipc.invoke('persist:save', { key, data })
      }
    } catch (err) {
      console.warn('Electron persist save failed, falling back to localStorage:', err)
      localStorage.setItem(key, data)
    }
  }, [isElectron])

  const electronLoad = useCallback(async (key: string): Promise<string | null> => {
    if (!isElectron) return null
    try {
      const ipc = (window as any).electron?.ipcRenderer
      if (ipc) {
        return await ipc.invoke('persist:load', { key })
      }
    } catch (err) {
      console.warn('Electron persist load failed, falling back to localStorage:', err)
      return localStorage.getItem(key)
    }
    return null
  }, [isElectron])

  const saveGame = useCallback(
    async (state: GameState) => {
      const serialized = JSON.stringify(state)

      if (isCapacitor) {
        // Native Capacitor storage (Preferences)
        await capacitorStorage.setItem(GAME_STATE_KEY, serialized)
      } else if (isElectron) {
        // Electron: use IPC to save to filesystem, fallback to localStorage
        await electronSave(GAME_STATE_KEY, serialized)
      } else {
        // Web: localStorage + IndexedDB fallback
        try {
          localStorage.setItem(GAME_STATE_KEY, serialized)
          // Optional: Also save to IndexedDB for larger data
          try {
            const objectStore = await openIndexedDB()
            await new Promise<void>((resolve, reject) => {
              const request = objectStore.put({ key: GAME_STATE_KEY, data: serialized })
              request.onerror = () => reject(request.error)
              request.onsuccess = () => resolve()
            })
          } catch (e) {
            console.warn('IndexedDB save failed:', e)
          }
        } catch (err) {
          console.error('Game state save failed:', err)
        }
      }
    },
    [isCapacitor, isElectron, capacitorStorage, electronSave],
  )

  const loadGame = useCallback(async (): Promise<GameState | null> => {
    try {
      let serialized: string | null = null

      if (isCapacitor) {
        // Native Capacitor storage
        serialized = await capacitorStorage.getItem(GAME_STATE_KEY)
      } else if (isElectron) {
        // Electron: load from IPC (fs), fallback to localStorage
        serialized = await electronLoad(GAME_STATE_KEY)
      } else {
        // Web: try localStorage first, then IndexedDB
        serialized = localStorage.getItem(GAME_STATE_KEY)
        if (!serialized) {
          try {
            const objectStore = await openIndexedDB()
            const item = await new Promise<{ key: string; data: string } | undefined>(
              (resolve, reject) => {
                const request = objectStore.get(GAME_STATE_KEY)
                request.onerror = () => reject(request.error)
                request.onsuccess = () => resolve(request.result)
              },
            )
            if (item) {
              serialized = item.data
            }
          } catch (e) {
            console.warn('IndexedDB load failed:', e)
          }
        }
      }

      return serialized ? JSON.parse(serialized) : null
    } catch (err) {
      console.error('Game state load failed:', err)
      return null
    }
  }, [isCapacitor, isElectron, capacitorStorage, electronLoad])

  const deleteGame = useCallback(async () => {
    if (isCapacitor) {
      await capacitorStorage.removeItem(GAME_STATE_KEY)
    } else if (isElectron) {
      try {
        const ipc = (window as any).electron?.ipcRenderer
        if (ipc) {
          await ipc.invoke('persist:delete', { key: GAME_STATE_KEY })
        }
      } catch (err) {
        console.warn('Electron persist delete failed, falling back to localStorage:', err)
        localStorage.removeItem(GAME_STATE_KEY)
      }
    } else {
      localStorage.removeItem(GAME_STATE_KEY)
      try {
        const objectStore = await openIndexedDB()
        await new Promise<void>((resolve, reject) => {
          const request = objectStore.delete(GAME_STATE_KEY)
          request.onerror = () => reject(request.error)
          request.onsuccess = () => resolve()
        })
      } catch (e) {
        console.warn('IndexedDB delete failed:', e)
      }
    }
  }, [isCapacitor, isElectron, capacitorStorage])

  return { saveGame, loadGame, deleteGame }
}

/**
 * Opens IndexedDB for web fallback storage
 * @internal
 */
async function openIndexedDB(): Promise<IDBObjectStore> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('nim-game-db', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction('game-state', 'readwrite')
      resolve(transaction.objectStore('game-state'))
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('game-state')) {
        db.createObjectStore('game-state')
      }
    }
  })
}
