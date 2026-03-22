import React from 'react'

export interface NimObjectProps {
  id: number
  selected?: boolean
  onClick?: () => void
}

/**
 * A single Nim object (a 3D-effect coin stack element).
 */
export const NimObject: React.FC<NimObjectProps> = ({ onClick, selected }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '40px',
        height: '14px',
        background: selected
          ? 'linear-gradient(180deg, #ffc107 0%, #ff8f00 100%)'
          : 'linear-gradient(180deg, #ffd54f 0%, #ffc107 100%)',
        margin: '2px 0',
        cursor: 'pointer',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '50% / 4px',
        display: 'block',
        position: 'relative',
        transition: 'all 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
        transform: selected ? 'scale(1.1) translateY(-4px)' : 'translateY(0)',
        boxShadow: selected ? '0 6px 12px rgba(255, 143, 0, 0.4)' : '0 2px 0 rgba(0, 0, 0, 0.2)',
        zIndex: selected ? 10 : 1,
      }}
      aria-label="Nim coin"
    >
      {/* 3D Rim Effect */}
      <div
        style={{
          position: 'absolute',
          top: '1px',
          left: '2px',
          right: '2px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50% / 2px',
        }}
      />
    </button>
  )
}
