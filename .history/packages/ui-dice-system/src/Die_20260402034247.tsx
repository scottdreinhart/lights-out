import type { DieValue } from '@games/common'

interface DieProps {
  value: DieValue
  isRolling?: boolean
  highlight?: boolean
  disabled?: boolean
  size?: number
  onClick?: () => void
  className?: string
}

const PIP_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [28, 28],
    [72, 28],
    [50, 50],
    [28, 72],
    [72, 72],
  ],
  6: [
    [28, 25],
    [72, 25],
    [28, 50],
    [72, 50],
    [28, 75],
    [72, 75],
  ],
}

export function Die({ value, isRolling, highlight, disabled, size = 72, onClick, className }: DieProps) {
  const pips = PIP_POSITIONS[value] ?? []

  const baseBackground = highlight
    ? 'linear-gradient(145deg, #fff9c4, #ffee58)'
    : 'linear-gradient(145deg, #ffffff, #e8e8e8)'

  const disabledBackground = 'linear-gradient(145deg, #e0e0e0, #d0d0d0)'

  const pipColor = highlight
    ? 'radial-gradient(circle at 40% 40%, #e65100, #bf360c)'
    : 'radial-gradient(circle at 40% 40%, #424242, #212121)'

  const disabledPipColor = 'radial-gradient(circle at 40% 40%, #999999, #666666)'

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: disabled ? disabledBackground : baseBackground,
        borderRadius: '14px',
        border: disabled
          ? '3px solid #a0a0a0'
          : highlight
            ? '3px solid #f9a825'
            : '3px solid #bdbdbd',
        boxShadow: disabled
          ? '0 2px 5px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.3)'
          : highlight
            ? '0 6px 20px rgba(249, 168, 37, 0.5), inset 0 1px 1px rgba(255,255,255,0.6)'
            : '0 4px 10px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.6)',
        position: 'relative',
        transition: 'all 0.3s ease',
        flexShrink: 0,
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        animation: isRolling ? 'dice-roll 0.1s infinite' : 'none',
        opacity: disabled ? 0.6 : 1,
      }}
      role="img"
      aria-label={disabled ? `Die showing ${value} (locked)` : `Die showing ${value}`}
    >
      <style>{`
        @keyframes dice-roll {
          0%, 100% { transform: rotateY(0deg) rotateX(0deg); }
          25% { transform: rotateY(90deg) rotateX(45deg); }
          50% { transform: rotateY(180deg) rotateX(90deg); }
          75% { transform: rotateY(270deg) rotateX(45deg); }
        }
      `}</style>

      {pips.map(([x, y], i) => (
        <div
          key={i}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: disabled ? disabledPipColor : pipColor,
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
          }}
        />
      ))}
    </div>
  )
}
