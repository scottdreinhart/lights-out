/**
 * War card game deterministic rule engine.
 * Configurable rule system supporting all major variants.
 */

export type WarRuleConfig = {
  /** Number of face-down cards in a war (standard: 3, quick: 1, extended: rank-based) */
  warFaceDownCards: number | 'rank'

  /** Whether to allow recursive war if tied cards appear again */
  allowRecursiveWar: boolean

  /** Whether to reshuffle discards when main deck runs out */
  reshuffleOnEmpty: boolean

  /** Number of players (2, 3, or 4) */
  playerCount: 2 | 3 | 4

  /** Behavior when player runs out of cards during war */
  outOfCardsBehavior: 'lose' | 'useLastCard' | 'useSameSizeDeck'

  /** Whether to include jokers (count as highest cards) */
  includeJokers: boolean
}

/**
 * Default rule configuration (classic War game)
 */
export const DEFAULT_RULES: WarRuleConfig = {
  warFaceDownCards: 3,
  allowRecursiveWar: true,
  reshuffleOnEmpty: true,
  playerCount: 2,
  outOfCardsBehavior: 'useLastCard',
  includeJokers: false,
}

/**
 * Pre-configured rule variants
 */
export const RULE_VARIANTS = {
  /** Classic War (default) */
  CLASSIC: DEFAULT_RULES,

  /** Quick War - single face-down card per war */
  QUICK_WAR: {
    ...DEFAULT_RULES,
    warFaceDownCards: 1,
  },

  /** Simple War - no re-shuffle, single deck */
  SIMPLE: {
    ...DEFAULT_RULES,
    reshuffleOnEmpty: false,
  },

  /** Extended War - rank-based face-down cards (e.g., 8 of a kind = 8 face-down) */
  EXTENDED_WAR: {
    ...DEFAULT_RULES,
    warFaceDownCards: 'rank',
  },

  /** Three-player War */
  THREE_PLAYER: {
    ...DEFAULT_RULES,
    playerCount: 3,
  },

  /** Four-player War */
  FOUR_PLAYER: {
    ...DEFAULT_RULES,
    playerCount: 4,
  },

  /** With Jokers (counted as highest cards) */
  WITH_JOKERS: {
    ...DEFAULT_RULES,
    includeJokers: true,
  },

  /** Limited Deck (no reshuffle, single-pass game) */
  LIMITED_DECK: {
    ...DEFAULT_RULES,
    reshuffleOnEmpty: false,
  },
} as const

/**
 * Determine number of face-down cards based on rule and card rank
 */
export function getWarCardCount(
  config: WarRuleConfig,
  triggeringCardRank: string
): number {
  if (config.warFaceDownCards === 'rank') {
    // Rank-based: rank value determines count (e.g., 8 = 8 face-down)
    const rankMap: Record<string, number> = {
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      'J': 11,
      'Q': 12,
      'K': 13,
      'A': 14,
    }
    return rankMap[triggeringCardRank] || 3
  }
  return config.warFaceDownCards as number
}

/**
 * Validate rule configuration for consistency
 */
export function validateRules(config: WarRuleConfig): string[] {
  const errors: string[] = []

  if (![2, 3, 4].includes(config.playerCount)) {
    errors.push('Player count must be 2, 3, or 4')
  }

  if (
    config.warFaceDownCards !== 'rank' &&
    (config.warFaceDownCards < 1 || config.warFaceDownCards > 20)
  ) {
    errors.push('War face-down cards must be 1-20 or "rank"')
  }

  if (!['lose', 'useLastCard', 'useSameSizeDeck'].includes(config.outOfCardsBehavior)) {
    errors.push('Invalid outOfCardsBehavior')
  }

  return errors
}

/**
 * Description of a rule variant (for UI/settings display)
 */
export function describeRules(config: WarRuleConfig): string {
  const parts: string[] = []

  parts.push(`${config.playerCount}-player`)

  if (config.warFaceDownCards === 'rank') {
    parts.push('rank-based wars')
  } else {
    parts.push(`${config.warFaceDownCards}-card wars`)
  }

  if (config.includeJokers) {
    parts.push('with jokers')
  }

  if (!config.reshuffleOnEmpty) {
    parts.push('single deck')
  }

  return parts.join(', ')
}
