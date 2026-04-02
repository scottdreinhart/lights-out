/**
 * Pit component for seed/pebble-based games (Mancala, etc.)
 * Displays a quantity of items in a visual pit or store
 */

interface PitProps {
  count: number
  isPlayerPit?: boolean
  label?: string
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  compact?: boolean
  className?: string
}

export function Pit({
  count,
  isPlayerPit = false,
  label,
  size = 'medium',
  onClick,
  compact,
  className,
}: PitProps) {
  const sizeMap = {
    small: { pitWidth: '60px', pitHeight: '80px', fontSize: '0.85rem', badgeSize: '20px' },
    medium: { pitWidth: '80px', pitHeight: '100px', fontSize: '1rem', badgeSize: '28px' },
    large: { pitWidth: '100px', pitHeight: '120px', fontSize: '1.2rem', badgeSize: '36px' },
  }

  const { pitWidth, pitHeight, fontSize, badgeSize } = sizeMap[size]

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: compact ? '0.5rem' : '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      aria-label={label ? `${label}, ${count} seeds` : `Store with ${count} seeds`}
    >
      {/* Pit container */}
      <div
        style={{
          width: pitWidth,
          height: pitHeight,
          background: isPlayerPit
            ? 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)'
            : 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
          borderRadius: `${size === 'small' ? '8px' : size === 'medium' ? '12px' : '16px'} ${size === 'small' ? '8px' : size === 'medium' ? '12px' : '16px'} ${size === 'small' ? '4px' : size === 'medium' ? '6px' : '8px'} ${size === 'small' ? '4px' : size === 'medium' ? '6px' : '8px'}`,
          boxShadow: isPlayerPit
            ? '0 8px 20px rgba(25, 103, 210, 0.4), inset 0 -2px 8px rgba(0,0,0,0.2)'
            : '0 8px 20px rgba(211, 47, 47, 0.4), inset 0 -2px 8px rgba(0,0,0,0.2)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          transform: onClick ? 'scale(1)' : undefined,
        }}
        onMouseEnter={(e) => {
          if (onClick) {
            ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'
          }
        }}
        onMouseLeave={(e) => {
          if (onClick) {
            ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          }
        }}
      >
        {/* Seed count badge */}
        <div
          style={{
            width: badgeSize,
            height: badgeSize,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            border: '2px solid rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize,
            fontWeight: '700',
            color: '#ffffff',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {count}
        </div>
      </div>

      {/* Label below pit */}
      {label && (
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: '600',
            color: isPlayerPit ? '#42a5f5' : '#ef5350',
            textAlign: 'center',
          }}
        >
          {label}
        </div>
      )}
    </div>
  )
}
