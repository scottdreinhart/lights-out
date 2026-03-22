import React, { useMemo, useEffect, useState } from 'react'
import { useWasmParticles } from '@/app'

import styles from './StarExplosion.module.css'

interface StarExplosionProps {
  isActive: boolean
  palette?: string[]
  children?: React.ReactNode
  useWasm?: boolean
}

/**
 * StarExplosion renders an animated burst of stars with RGB-split shader effects.
 * Optionally uses WASM particle system for enhanced physics and performance.
 * - CSS-based: 80 stars with smooth animations
 * - WASM-based: 120+ stars with physics, gravity, bounce, and trails
 */
const StarExplosion: React.FC<StarExplosionProps> = ({
  isActive,
  palette = ['#667eea', '#764ba2', '#fbbf24'],
  children,
  useWasm = true,
}) => {
  const STAR_COUNT = 120 // Increased for WASM version
  const CSS_STAR_COUNT = 80

  // WASM particle system
  const { particles: wasmParticles, isReady: wasmReady, triggerBurst } = useWasmParticles(
    800,
    600,
    palette.length,
  )

  const [showWasmParticles, setShowWasmParticles] = useState(false)

  // Trigger WASM burst when active
  useEffect(() => {
    if (isActive && useWasm && wasmReady) {
      setShowWasmParticles(true)
      triggerBurst(400, 300, STAR_COUNT, 4.5)
    } else {
      setShowWasmParticles(false)
    }
  }, [isActive, useWasm, wasmReady, triggerBurst])

  // CSS-based star generation (fallback)
  const stars = useMemo(() => {
    if (!isActive) return []

    return Array.from({ length: CSS_STAR_COUNT }, (_, i) => {
      const angle = (i / CSS_STAR_COUNT) * Math.PI * 2
      const velocity = 3 + Math.random() * 4
      const vx = Math.cos(angle) * velocity
      const vy = Math.sin(angle) * velocity

      const size = 6 + Math.random() * 12
      const rotationSpeed = 180 + Math.random() * 360
      const duration = 1.2 + Math.random() * 0.8
      const colorIndex = i % palette.length
      const color = palette[colorIndex]

      return {
        id: i,
        vx,
        vy,
        size,
        rotationSpeed,
        duration,
        delay: Math.random() * 0.08,
        color,
      }
    })
  }, [isActive, palette])

  if (!isActive) {
    return <>{children}</>
  }

  // Use WASM particles if available
  if (useWasm && wasmReady && showWasmParticles && wasmParticles.length > 0) {
    return (
      <div
        className={styles.explosionContainer}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div className={styles.starsWrapper}>
          {wasmParticles.map((particle, i) => (
            <div
              key={i}
              className={styles.star}
              style={{
                '--star-x': `${particle.x}px`,
                '--star-y': `${particle.y}px`,
                '--star-opacity': particle.opacity.toString(),
                '--star-size': '8px',
                '--star-rotation': `${Math.random() * 360}deg`,
                '--star-color': palette[particle.colorIndex % palette.length],
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                opacity: particle.opacity,
              } as React.CSSProperties & Record<string, any>}
            >
              ✦
            </div>
          ))}
        </div>
        {children}
      </div>
    )
  }

  // Fallback: CSS-based stars
  return (
    <div
      className={styles.explosionContainer}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div className={styles.starsWrapper}>
        {stars.map((star) => (
          <div
            key={star.id}
            className={styles.star}
            style={{
              '--star-vx': `${star.vx}px`,
              '--star-vy': `${star.vy}px`,
              '--star-size': `${star.size}px`,
              '--star-rotation': `${star.rotationSpeed}deg`,
              '--star-duration': `${star.duration}s`,
              '--star-delay': `${star.delay}s`,
              color: star.color,
              left: '50%',
              top: '50%',
            } as React.CSSProperties & { [key: string]: string }}
          >
            ★
          </div>
        ))}
      </div>

      {children}
    </div>
  )
}

export default React.memo(StarExplosion)
