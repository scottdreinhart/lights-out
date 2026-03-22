import { NimObject } from '@/ui'
import React from 'react'

export interface PileProps {
  id: number
  count: number
  selectedCount: number
  onObjectClick: (pileId: number, index: number) => void
  disabled?: boolean
}

/**
 * A pile of Nim objects.
 */
export const PileToggle: React.FC<PileProps> = ({
  id,
  count,
  selectedCount,
  onObjectClick,
  disabled,
}) => {
  const isPileSelected = selectedCount > 0

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem',
        borderRadius: '16px',
        background: isPileSelected ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        border: isPileSelected ? '2px solid #ff8f00' : '2px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        width: '100%',
        minHeight: '120px',
        pointerEvents: disabled ? 'none' : 'auto',
        boxShadow: isPileSelected ? '0 8px 32px rgba(255, 143, 0, 0.2)' : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          gap: '1px',
          flexGrow: 1,
          width: '100%',
          paddingBottom: '8px',
        }}
      >
        <div
          style={{
            height: '4px',
            width: '60px',
            background: '#8d6e63',
            borderRadius: '50% / 2px',
            marginBottom: '4px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          }}
        />
        {Array.from({ length: count }).map((_, i) => (
          <NimObject
            key={i}
            id={i}
            selected={i < selectedCount}
            onClick={() => onObjectClick(id, i)}
          />
        ))}
      </div>
    </div>
  )
}
