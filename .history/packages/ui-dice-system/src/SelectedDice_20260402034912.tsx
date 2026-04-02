/**
 * SelectedDice component for games like Farkle and Pig
 * Shows dice that have been selected for scoring or banking
 */

import type { DieValue } from '@games/common'
import { Die } from './Die'

interface SelectedDiceProps {
  dice: DieValue[]
  dieSize?: number
  label?: string
  compact?: boolean
  onDieClick?: (index: number) => void
  className?: string
}

export function SelectedDice({
  dice,
  dieSize = 60,
  label,
  compact,
  onDieClick,
  className,
}: SelectedDiceProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: compact ? '0.5rem' : '1rem',
      }}
    >
      {label && (
        <div
          style={{
            fontSize: compact ? '0.9rem' : '1rem',
            fontWeight: '600',
            color: '#666',
          }}
        >
          {label}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: compact ? '6px' : '8px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          minHeight: `${dieSize}px`,
          padding: compact ? '0.5rem' : '0.75rem',
          background: 'rgba(0,0,0,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {dice.length > 0 ? (
          dice.map((value, i) => (
            <Die
              key={i}
              value={value}
              size={dieSize}
              onClick={onDieClick ? () => onDieClick(i) : undefined}
            />
          ))
        ) : (
          <div
            style={{
              color: '#999',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No dice selected
          </div>
        )}
      </div>
    </div>
  )
}
