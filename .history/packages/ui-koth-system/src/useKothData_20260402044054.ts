import { useCallback, useEffect, useState } from 'react'
import type { KothEntry, UseKothDataConfig, UseKothDataResult } from './types'

/**
 * Hook to manage KotH (King of the Hill) ranking data
 * Persists to localStorage with automatic ranking calculation
 *
 * @example
 * const koth = useKothData({ gameName: 'sudoku', maxEntries: 1000 })
 * koth.addEntry({ username: 'Player', score: 1500, timestamp: Date.now() })
 * const topTen = koth.getEntries(10)
 */
export function useKothData(config: UseKothDataConfig): UseKothDataResult {
  const { gameName, maxEntries = 1000 } = config
  const [entries, setEntries] = useState<KothEntry[]>([])

  const storageKey = `koth-${gameName}-entries`

  // Load entries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const data = JSON.parse(stored) as KothEntry[]
        setEntries(data)
      } catch {
        console.error(`Failed to parse KotH data for ${gameName}`)
        setEntries([])
      }
    }
  }, [storageKey, gameName])

  // Calculate ranks for entries
  const calculateRanks = useCallback((items: KothEntry[]): KothEntry[] => {
    // Sort by score (descending), then by timestamp (ascending for tie-breaking)
    const sorted = [...items].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.timestamp - b.timestamp
    })

    // Assign ranks
    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
  }, [])

  // Add new entry and recalculate rankings
  const addEntry = useCallback(
    (entry: Omit<KothEntry, 'id' | 'rank'>) => {
      const newEntry: KothEntry = {
        ...entry,
        id: `${entry.username}-${entry.timestamp}`,
        rank: 1, // Will be recalculated
      }

      let updatedEntries = [...entries, newEntry]

      // Keep only top maxEntries by score (or by timestamp if tied)
      updatedEntries = updatedEntries.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return a.timestamp - b.timestamp
      })

      if (updatedEntries.length > maxEntries) {
        updatedEntries = updatedEntries.slice(0, maxEntries)
      }

      // Recalculate all ranks
      const ranked = calculateRanks(updatedEntries)
      setEntries(ranked)

      // Persist to localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify(ranked))
      } catch {
        console.error(`Failed to save KotH data for ${gameName}`)
      }
    },
    [entries, calculateRanks, storageKey, gameName, maxEntries],
  )

  // Get sorted entries, optionally limited
  const getEntries = useCallback(
    (limit?: number): KothEntry[] => {
      if (limit) return entries.slice(0, limit)
      return entries
    },
    [entries],
  )

  // Get player's rank by username
  const getPlayerRank = useCallback(
    (username: string): number | undefined => {
      const entry = entries.find((e) => e.username === username)
      return entry?.rank
    },
    [entries],
  )

  // Clear all entries (mainly for testing)
  const clearEntries = useCallback(() => {
    setEntries([])
    try {
      localStorage.removeItem(storageKey)
    } catch {
      console.error(`Failed to clear KotH data for ${gameName}`)
    }
  }, [storageKey, gameName])

  return {
    entries,
    addEntry,
    getEntries,
    getPlayerRank,
    clearEntries,
  }
}
