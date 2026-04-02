import type { DieValue, RollResult } from '@/domain'
import { DiceArea as SharedDiceArea } from '@games/ui-dice-system'

interface DiceAreaProps {
  dice: [DieValue, DieValue, DieValue] | null
  target: DieValue
  isRolling: boolean
  lastRoll: RollResult | null
  dieSize?: number
  compact?: boolean
}

/**
 * Convert Bunco's RollResult to shared DiceArea feedback format
 */
function getRollResultFeedback(rollResult: RollResult | null): { type?: 'success' | 'warning' | 'error'; text?: string } | undefined {
  if (!rollResult) return undefined

  if (rollResult.isBunco) {
    return { type: 'success', text: 'BUNCO!' }
  }
  if (rollResult.isMiniBunco) {
    return { type: 'success', text: 'Mini Bunco! +5' }
  }
  if (rollResult.points > 0) {
    return { type: 'success', text: `+${rollResult.points} point${rollResult.points > 1 ? 's' : ''}!` }
  }
  return { type: 'error', text: 'No match' }
}

export function DiceArea({
  dice,
  target,
  isRolling,
  lastRoll,
  dieSize = 72,
  compact,
}: DiceAreaProps) {
  const feedback = !isRolling && lastRoll ? getRollResultFeedback(lastRoll) : undefined

  return (
    <SharedDiceArea
      dice={dice}
      isRolling={isRolling}
      feedback={feedback}
      dieSize={dieSize}
      compact={compact}
      highlightValues={dice && !isRolling ? [target] : []}
      emptySlots={3}
    />
  )
}
