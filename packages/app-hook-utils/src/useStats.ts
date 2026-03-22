import { useCallback, useState } from 'react'
import { nextLossStats, nextWinStats, type StatsShape } from '@games/stats-utils'

type LoadStats<T extends StatsShape> = (key: string, fallback: T) => T | null | undefined
type SaveStats<T extends StatsShape> = (key: string, value: T) => void

interface UseStatsConfig<T extends StatsShape> {
	storageKey: string
	defaultStats: T
	load: LoadStats<T>
	save: SaveStats<T>
}

export interface UseStatsResult<T extends StatsShape> {
	stats: T
	recordWin: () => void
	recordLoss: () => void
	resetStats: () => void
}

export const useStats = <T extends StatsShape>({
	storageKey,
	defaultStats,
	load,
	save,
}: UseStatsConfig<T>): UseStatsResult<T> => {
	const [stats, setStats] = useState<T>(() => load(storageKey, defaultStats) ?? defaultStats)

	const recordWin = useCallback(() => {
		setStats((prev) => {
			const next = nextWinStats(prev)
			save(storageKey, next)
			return next
		})
	}, [save, storageKey])

	const recordLoss = useCallback(() => {
		setStats((prev) => {
			const next = nextLossStats(prev)
			save(storageKey, next)
			return next
		})
	}, [save, storageKey])

	const resetStats = useCallback(() => {
		save(storageKey, defaultStats)
		setStats(defaultStats)
	}, [defaultStats, save, storageKey])

	return { stats, recordWin, recordLoss, resetStats }
}