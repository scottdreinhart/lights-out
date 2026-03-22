import React from 'react'

interface OMarkProps {
  className?: string | undefined
}

const OMark = React.memo<OMarkProps>(({ className }) => (
  <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="30" />
  </svg>
))

OMark.displayName = 'OMark'

export default OMark
