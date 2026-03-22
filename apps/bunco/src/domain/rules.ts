import type { DieValue, Player, RollResult } from './types'

/**
 * Scores a dice roll against the current round's target number.
 * - Bunco (3 matching target): 21 points
 * - Mini Bunco (3 of a kind, non-target): 5 points
 * - Otherwise: 1 point per die matching target
 */
export function scoreRoll(dice: [DieValue, DieValue, DieValue], target: DieValue): RollResult {
  const [d1, d2, d3] = dice
  const isThreeOfKind = d1 === d2 && d2 === d3

  if (isThreeOfKind && d1 === target) {
    return { dice, points: 21, isBunco: true, isMiniBunco: false, matchCount: 3 }
  }

  if (isThreeOfKind) {
    return { dice, points: 5, isBunco: false, isMiniBunco: true, matchCount: 0 }
  }

  const matchCount = [d1, d2, d3].filter((d) => d === target).length
  return { dice, points: matchCount, isBunco: false, isMiniBunco: false, matchCount }
}

/**
 * A player continues rolling if they scored any points.
 */
export function shouldContinueRolling(result: RollResult): boolean {
  return result.points > 0
}

/**
 * Checks if either player has reached 21 points in the current round.
 */
export function isRoundOver(humanScore: number, cpuScore: number): boolean {
  return humanScore >= 21 || cpuScore >= 21
}

/**
 * Determines the round winner based on scores.
 */
export function getRoundWinner(humanScore: number, cpuScore: number): Player | null {
  if (humanScore >= 21) {
    return 'human'
  }
  if (cpuScore >= 21) {
    return 'cpu'
  }
  return null
}

/**
 * Determines the overall game winner after all rounds.
 * Primary: most round wins. Tiebreaker: highest total score.
 */
export function getGameWinner(
  humanWins: number,
  cpuWins: number,
  humanTotal: number,
  cpuTotal: number,
): Player {
  if (humanWins !== cpuWins) {
    return humanWins > cpuWins ? 'human' : 'cpu'
  }
  return humanTotal >= cpuTotal ? 'human' : 'cpu'
}
