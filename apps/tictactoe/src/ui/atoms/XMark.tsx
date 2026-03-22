import React from 'react'

interface XMarkProps {
  className?: string | undefined
}

const XMark = React.memo<XMarkProps>(({ className }) => (
  <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
    <line x1="20" y1="20" x2="80" y2="80" />
    <line x1="80" y1="20" x2="20" y2="80" />
  </svg>
))

XMark.displayName = 'XMark'

export default XMark
