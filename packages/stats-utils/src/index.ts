export type StatsShape = {
  wins: number
  losses: number
  streak: number
  bestStreak: number
}

export const DEFAULT_STATS: StatsShape = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
}

export const nextWinStats = <T extends StatsShape>(prev: T): T => {
  const nextStreak = prev.streak + 1
  return {
    ...prev,
    wins: prev.wins + 1,
    streak: nextStreak,
    bestStreak: Math.max(prev.bestStreak, nextStreak),
  }
}

export const nextLossStats = <T extends StatsShape>(prev: T): T => {
  return {
    ...prev,
    losses: prev.losses + 1,
    streak: 0,
  }
}
