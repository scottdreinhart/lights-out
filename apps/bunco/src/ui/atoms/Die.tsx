import type { DieValue } from '@/domain'

interface DieProps {
  value: DieValue
  isRolling?: boolean
  highlight?: boolean
  size?: number
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

export function Die({ value, isRolling, highlight, size = 72 }: DieProps) {
  const pips = PIP_POSITIONS[value] ?? []

  return (
    <div
      className={isRolling ? 'dice-rolling' : undefined}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: highlight
          ? 'linear-gradient(145deg, #fff9c4, #ffee58)'
          : 'linear-gradient(145deg, #ffffff, #e8e8e8)',
        borderRadius: '14px',
        border: highlight ? '3px solid #f9a825' : '3px solid #bdbdbd',
        boxShadow: highlight
          ? '0 6px 20px rgba(249, 168, 37, 0.5), inset 0 1px 1px rgba(255,255,255,0.6)'
          : '0 4px 10px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.6)',
        position: 'relative',
        transition: 'all 0.3s ease',
        flexShrink: 0,
      }}
      role="img"
      aria-label={`Die showing ${value}`}
    >
      {pips.map(([x, y], i) => (
        <div
          key={i}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: highlight
              ? 'radial-gradient(circle at 40% 40%, #e65100, #bf360c)'
              : 'radial-gradient(circle at 40% 40%, #424242, #212121)',
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
