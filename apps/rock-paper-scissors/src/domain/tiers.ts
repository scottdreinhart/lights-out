/**
 * Game tier definitions and constants.
 */

export const GAME_TIERS = [3, 5, 7, 9, 11, 13] as const
export type GameTier = (typeof GAME_TIERS)[number]

export const DEFAULT_TIER: GameTier = 3

export const TIER_LABELS: Record<GameTier, string> = {
  3: 'Quick (Best of 3)',
  5: 'Standard (Best of 5)',
  7: 'Extended (Best of 7)',
  9: 'Epic (Best of 9)',
  11: 'Ultimate (Best of 11)',
  13: 'Legendary (Best of 13)',
}

export const TIER_DESCRIPTIONS: Record<GameTier, string> = {
  3: 'Win 2 rounds',
  5: 'Win 3 rounds',
  7: 'Win 4 rounds',
  9: 'Win 5 rounds',
  11: 'Win 6 rounds',
  13: 'Win 7 rounds',
}
