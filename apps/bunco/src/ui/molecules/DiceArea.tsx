import type { DieValue, RollResult } from '@/domain'
import { Die } from '@/ui/atoms'

interface DiceAreaProps {
  dice: [DieValue, DieValue, DieValue] | null
  target: DieValue
  isRolling: boolean
  lastRoll: RollResult | null
  dieSize?: number
  compact?: boolean
}

export function DiceArea({
  dice,
  target,
  isRolling,
  lastRoll,
  dieSize = 72,
  compact,
}: DiceAreaProps) {
  const gap = compact ? '10px' : '16px'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap,
        padding: compact ? '1rem' : '2rem',
        background: 'rgba(0,0,0,0.15)',
        borderRadius: '24px',
        minHeight: compact ? '120px' : '160px',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', gap, justifyContent: 'center' }}>
        {isRolling && !dice
          ? ([1, 4, 2] as DieValue[]).map((v, i) => (
              <Die key={i} value={v} isRolling size={dieSize} />
            ))
          : dice
            ? dice.map((value, i) => (
                <Die
                  key={i}
                  value={value}
                  isRolling={isRolling}
                  highlight={!isRolling && value === target}
                  size={dieSize}
                />
              ))
            : [0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: `${dieSize}px`,
                    height: `${dieSize}px`,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '14px',
                    border: '2px dashed rgba(255,255,255,0.15)',
                  }}
                />
              ))}
      </div>

      {lastRoll && !isRolling && (
        <div aria-live="polite" style={{ textAlign: 'center', minHeight: '28px' }}>
          {lastRoll.isBunco && (
            <div
              style={{
                fontSize: compact ? '1.2rem' : '1.5rem',
                fontWeight: '900',
                color: '#ffd600',
                letterSpacing: '4px',
              }}
            >
              BUNCO!
            </div>
          )}
          {lastRoll.isMiniBunco && (
            <div
              style={{
                fontSize: compact ? '1rem' : '1.2rem',
                fontWeight: '700',
                color: '#ce93d8',
              }}
            >
              Mini Bunco! +5
            </div>
          )}
          {!lastRoll.isBunco && !lastRoll.isMiniBunco && lastRoll.points > 0 && (
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#81c784' }}>
              +{lastRoll.points} point{lastRoll.points > 1 ? 's' : ''}!
            </div>
          )}
          {!lastRoll.isBunco && !lastRoll.isMiniBunco && lastRoll.points === 0 && (
            <div style={{ fontSize: '1rem', color: '#ef9a9a' }}>No match</div>
          )}
        </div>
      )}
    </div>
  )
}
