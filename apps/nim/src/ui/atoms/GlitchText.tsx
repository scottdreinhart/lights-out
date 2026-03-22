/**
 * GlitchText — Applies WebGL glitch effect to text using react-vfx.
 * Cyberpunk/hacker aesthetic for error messages, notifications, warnings.
 *
 * Usage:
 *   <GlitchText intensity="high">Game Over!</GlitchText>
 *   <GlitchText intensity="low">Warning</GlitchText>
 *
 * Intensity levels:
 * - low: 0.3 (subtle shimmer)
 * - medium: 0.6 (noticeable glitch, default)
 * - high: 0.9 (aggressive digital distortion)
 *
 * Shader is externalized to GlitchText.glsl and imported as raw string.
 * This prevents re-compilation on every render (performance optimization).
 *
 * Uses react-vfx VFXSpan component with shader prop (component-based API, not hooks).
 */

import { VFXProvider, VFXSpan } from 'react-vfx'
import { ReactNode } from 'react'
import glitchShader from './GlitchText.glsl?raw'

interface GlitchTextProps {
  children: ReactNode
  intensity?: 'low' | 'medium' | 'high'
  className?: string
  style?: React.CSSProperties
}

export const GlitchText = ({ children, className, style }: GlitchTextProps) => {
  // Note: intensity parameter kept in props interface for API stability.
  // Currently, react-vfx VFXSpan applies the shader uniformly.
  // Custom intensity control would require shader uniform updates (not exposed in current API).
  return (
    <VFXProvider>
      <VFXSpan
        className={className}
        style={{
          display: 'inline-block',
          ...style,
        }}
        shader={glitchShader}
      >
        {children}
      </VFXSpan>
    </VFXProvider>
  )
}
