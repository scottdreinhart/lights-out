interface RockIconProps {
  size?: number
  className?: string
}

export function RockIcon({ size = 64, className = '' }: RockIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Fist shape */}
      <ellipse cx="32" cy="28" rx="18" ry="22" fill="currentColor" />
      {/* Thumb */}
      <rect x="8" y="16" width="10" height="16" rx="5" fill="currentColor" />
      {/* Palm center */}
      <ellipse cx="32" cy="32" rx="14" ry="16" fill="currentColor" />
      {/* Knuckles highlight */}
      <ellipse cx="32" cy="20" rx="12" ry="8" fill="currentColor" opacity="0.8" />
    </svg>
  )
}
