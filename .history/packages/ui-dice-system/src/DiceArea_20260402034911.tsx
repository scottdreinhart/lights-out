import type { DieValue } from '@games/common'
import { Die } from './Die'

interface DiceAreaProps {
  dice: DieValue[] | null
  isRolling?: boolean
  feedback?: {
    type?: 'success' | 'neutral' | 'warning' | 'error'
    text?: string
  }
  dieSize?: number
  compact?: boolean
  highlightValues?: number[]
  disabledIndices?: number[]
  onDieClick?: (index: number) => void
  emptySlots?: number
  className?: string
}

export function DiceArea({
  dice,
  isRolling,
  feedback,
  dieSize = 72,
  compact,
  highlightValues = [],
  disabledIndices = [],
  onDieClick,
  emptySlots = 3,
  className,
}: DiceAreaProps) {
  const gap = compact ? '10px' : '16px'
  const padding = compact ? '1rem' : '2rem'
  const minHeight = compact ? '120px' : '160px'

  const feedbackColor =
    feedback?.type === 'success'
      ? '#81c784'
      : feedback?.type === 'warning'
        ? '#ffd600'
        : feedback?.type === 'error'
          ? '#ef9a9a'
          : '#b0bec5'

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap,
        padding,
        background: 'rgba(0,0,0,0.15)',
        borderRadius: '24px',
        minHeight,
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', gap, justifyContent: 'center', flexWrap: 'wrap' }}>
        {isRolling && !dice
          ? // Rolling animation: show cycling values
            ([1, 4, 2] as DieValue[]).map((v, i) => (
              <Die key={i} value={v} isRolling size={dieSize} />
            ))
          : dice
            ? // Show actual dice
              [
                ...dice.map((value, i) => (
                  <Die
                    key={i}
                    value={value}
                    isRolling={false}
                    highlight={highlightValues.includes(value)}
                    disabled={disabledIndices.includes(i)}
                    size={dieSize}
                    onClick={onDieClick ? () => onDieClick(i) : undefined}
                  />
                )),
                // Show empty slots
                ...Array.from({ length: emptySlots - dice.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    style={{
                      width: `${dieSize}px`,
                      height: `${dieSize}px`,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '14px',
                      border: '2px dashed rgba(255,255,255,0.15)',
                    }}
                  />
                )),
              ]
            : // Empty state: show all empty slots
              Array.from({ length: emptySlots }).map((_, i) => (
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

      {feedback?.text && (
        <div
          aria-live="polite"
          style={{
            textAlign: 'center',
            minHeight: '28px',
            color: feedbackColor,
            fontWeight: '600',
            fontSize: compact ? '0.95rem' : '1rem',
          }}
        >
          {feedback.text}
        </div>
      )}
    </div>
  )
}
