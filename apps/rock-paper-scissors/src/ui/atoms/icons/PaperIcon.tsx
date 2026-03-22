interface PaperIconProps {
  size?: number
  className?: string
}

export function PaperIcon({ size = 64, className = '' }: PaperIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Palm background */}
      <ellipse cx="32" cy="32" rx="16" ry="22" fill="currentColor" />
      {/* Fingers - extended upward */}
      <rect x="12" y="8" width="8" height="28" rx="4" fill="currentColor" />
      <rect x="24" y="4" width="8" height="32" rx="4" fill="currentColor" />
      <rect x="36" y="4" width="8" height="32" rx="4" fill="currentColor" />
      <rect x="48" y="8" width="8" height="28" rx="4" fill="currentColor" />
      {/* Palm lines for detail */}
      <line x1="20" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="18" y1="42" x2="46" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}
