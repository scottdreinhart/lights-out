import type { StatsShape } from '@games/stats-utils'

import { useStats, type UseStatsResult } from './useStats'

type LoadStats<T extends StatsShape> = (key: string, fallback: T) => T | null | undefined
type SaveStats<T extends StatsShape> = (key: string, value: T) => void

interface CreateUseStatsConfig<T extends StatsShape> {
	storageKey: string
	defaultStats: T
	load: LoadStats<T>
	save: SaveStats<T>
}

export const createUseStatsHook = <T extends StatsShape>(
	config: CreateUseStatsConfig<T>,
): (() => UseStatsResult<T>) => {
	return () => useStats(config)
}