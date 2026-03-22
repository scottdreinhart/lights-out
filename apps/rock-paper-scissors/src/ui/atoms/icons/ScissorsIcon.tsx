interface ScissorsIconProps {
  size?: number
  className?: string
}

export function ScissorsIcon({ size = 64, className = '' }: ScissorsIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left blade */}
      <g>
        {/* Handle circle */}
        <circle cx="18" cy="20" r="6" fill="currentColor" />
        {/* Handle connection */}
        <rect x="16" y="26" width="4" height="12" fill="currentColor" />
        {/* Blade */}
        <path
          d="M 18 38 Q 20 50 18 56"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Right blade */}
      <g>
        {/* Handle circle */}
        <circle cx="46" cy="20" r="6" fill="currentColor" />
        {/* Handle connection */}
        <rect x="44" y="26" width="4" height="12" fill="currentColor" />
        {/* Blade */}
        <path
          d="M 46 38 Q 44 50 46 56"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Center screw */}
      <circle cx="32" cy="32" r="3" fill="currentColor" />
    </svg>
  )
}
