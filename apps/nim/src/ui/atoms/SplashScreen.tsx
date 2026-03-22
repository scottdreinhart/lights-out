/**
 * SplashScreen — Themed splash screen that reads colors from localStorage.
 * Uses the stored theme settings or falls back to classic theme.
 *
 * This component loads theme colors synchronously from localStorage
 * to ensure the splash screen displays immediately with the correct theme.
 */

import { useMemo } from 'react'
import { SHARED_THEME_COLORS } from '@games/domain-shared'
import type { ThemeSettings } from '@/domain'
import { load } from '@/infrastructure/storage'
import { DEFAULT_SETTINGS } from '@/ui/theme/themeRegistry'

interface SplashScreenProps {
  title?: string
}

export function SplashScreen({ title = 'Nim' }: SplashScreenProps) {
  // Load theme colors from localStorage
  const colors = useMemo(() => {
    const STORAGE_KEY = 'nim-theme-settings'
    const settings = load<ThemeSettings>(STORAGE_KEY, DEFAULT_SETTINGS)
    const themeId = settings.colorTheme
    return SHARED_THEME_COLORS[themeId] || SHARED_THEME_COLORS.classic
  }, [])

  const primaryColor = colors['--theme-primary']
  const bgColor = colors['--theme-bg']
  const fgColor = colors['--theme-fg']

  return (
    <div
      className="nim-splash"
      style={{
        background: `linear-gradient(160deg, ${bgColor} 0%, ${adjustColorBrightness(bgColor, 20)} 42%, ${adjustColorBrightness(bgColor, 40)} 100%)`,
      }}
    >
      {/* Animated orb (primary color glow) */}
      <div
        className="nim-splash__orb"
        style={{
          background: `radial-gradient(
            circle at 30% 30%,
            rgba(${hexToRgb(primaryColor).join(',')}, 0.8),
            rgba(${hexToRgb(primaryColor).join(',')}, 0.4) 50%,
            transparent
          )`,
          boxShadow: `
            0 0 10px rgba(${hexToRgb(primaryColor).join(',')}, 0.4),
            0 0 30px rgba(${hexToRgb(primaryColor).join(',')}, 0.2),
            inset 0 0 20px rgba(${hexToRgb(primaryColor).join(',')}, 0.1)
          `,
        }}
      />

      {/* Grid pattern (primary color) */}
      <div
        className="nim-splash__grid"
        style={{
          backgroundImage: `
            linear-gradient(rgba(${hexToRgb(primaryColor).join(',')}, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${hexToRgb(primaryColor).join(',')}, 0.05) 1px, transparent 1px)
          `,
        }}
      />

      {/* Logo */}
      <div className="nim-splash__logo">
        <div className="nim-splash__badge">
          <div className="nim-splash__emoji">🎯</div>
        </div>
        <h1
          className="nim-splash__title"
          style={{
            background: `linear-gradient(180deg, ${fgColor} 0%, ${adjustColorBrightness(fgColor, -30)} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  )
}

/**
 * Convert hex color to RGB values
 * @example hexToRgb('#667eea') → [102, 126, 234]
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [100, 100, 100]
}

/**
 * Adjust brightness of a hex color
 * @example adjustColorBrightness('#1a1a2e', 20) → darker shade
 */
function adjustColorBrightness(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex)
  const factor = 1 + percent / 100

  const newR = Math.min(255, Math.max(0, Math.round(r * factor)))
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)))
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)))

  return `rgb(${newR}, ${newG}, ${newB})`
}
