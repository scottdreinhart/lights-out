import { load } from '@/app'
import type { ThemeSettings } from '@/domain'
import { DEFAULT_SETTINGS } from '@/domain'
import { AppWithProviders } from '@/ui'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

const EARLY_THEME_COLORS: Record<string, Record<string, string>> = {
  'chiba-city': {
    '--theme-primary': '#00ff41',
    '--theme-secondary': '#00cc33',
    '--theme-accent': '#00ff41',
    '--theme-bg': '#0a0e27',
    '--theme-fg': '#e0e0e0',
    '--theme-card': '#1a1f3a',
    '--theme-border': '#00ff41',
  },
  'neon-core': {
    '--theme-primary': '#667eea',
    '--theme-secondary': '#764ba2',
    '--theme-accent': '#667eea',
    '--theme-bg': '#1a1a2e',
    '--theme-fg': '#e0e0e0',
    '--theme-card': '#2d2d44',
    '--theme-border': '#3d3d5c',
  },
  'neon-arcade': {
    '--theme-primary': '#0ea5e9',
    '--theme-secondary': '#06b6d4',
    '--theme-accent': '#0ea5e9',
    '--theme-bg': '#0f172a',
    '--theme-fg': '#e0e7ff',
    '--theme-card': '#1e293b',
    '--theme-border': '#0ea5e9',
  },
  'night-district': {
    '--theme-primary': '#f97316',
    '--theme-secondary': '#ea580c',
    '--theme-accent': '#f97316',
    '--theme-bg': '#1f1b1a',
    '--theme-fg': '#fde68a',
    '--theme-card': '#3d2c27',
    '--theme-border': '#f97316',
  },
  gridline: {
    '--theme-primary': '#22c55e',
    '--theme-secondary': '#16a34a',
    '--theme-accent': '#22c55e',
    '--theme-bg': '#0f2818',
    '--theme-fg': '#dcfce7',
    '--theme-card': '#1b4332',
    '--theme-border': '#22c55e',
  },
  vaporwave: {
    '--theme-primary': '#f43f5e',
    '--theme-secondary': '#e11d48',
    '--theme-accent': '#f43f5e',
    '--theme-bg': '#1f0f1a',
    '--theme-fg': '#ffe4e6',
    '--theme-card': '#3d1a28',
    '--theme-border': '#f43f5e',
  },
  synthwave: {
    '--theme-primary': '#a78bfa',
    '--theme-secondary': '#9333ea',
    '--theme-accent': '#a78bfa',
    '--theme-bg': '#1e1b4b',
    '--theme-fg': '#e9d5ff',
    '--theme-card': '#312e81',
    '--theme-border': '#a78bfa',
  },
  'high-contrast': {
    '--theme-primary': '#ffcc00',
    '--theme-secondary': '#ffaa00',
    '--theme-accent': '#ffcc00',
    '--theme-bg': '#000000',
    '--theme-fg': '#ffffff',
    '--theme-card': '#333333',
    '--theme-border': '#ffcc00',
  },
}

function getClassicThemeColors(themeId: string): Record<string, string> | null {
  if (themeId === 'chiba-city') {
    return EARLY_THEME_COLORS['chiba-city']
  }

  if (themeId === 'neon-core') {
    return EARLY_THEME_COLORS['neon-core']
  }

  if (themeId === 'neon-arcade') {
    return EARLY_THEME_COLORS['neon-arcade']
  }

  if (themeId === 'night-district') {
    return EARLY_THEME_COLORS['night-district']
  }

  return null
}

function getExperimentalThemeColors(themeId: string): Record<string, string> | null {
  if (themeId === 'gridline') {
    return EARLY_THEME_COLORS.gridline
  }

  if (themeId === 'vaporwave') {
    return EARLY_THEME_COLORS.vaporwave
  }

  if (themeId === 'synthwave') {
    return EARLY_THEME_COLORS.synthwave
  }

  if (themeId === 'high-contrast') {
    return EARLY_THEME_COLORS['high-contrast']
  }

  return null
}

function getEarlyThemeColors(themeId: string): Record<string, string> {
  return (
    getClassicThemeColors(themeId) ??
    getExperimentalThemeColors(themeId) ??
    EARLY_THEME_COLORS['chiba-city']
  )
}

function applyThemeColors(colors: Record<string, string>): void {
  const root = document.documentElement
  root.style.setProperty('--theme-primary', colors['--theme-primary'])
  root.style.setProperty('--theme-secondary', colors['--theme-secondary'])
  root.style.setProperty('--theme-accent', colors['--theme-accent'])
  root.style.setProperty('--theme-bg', colors['--theme-bg'])
  root.style.setProperty('--theme-fg', colors['--theme-fg'])
  root.style.setProperty('--theme-card', colors['--theme-card'])
  root.style.setProperty('--theme-border', colors['--theme-border'])
}

function initializeThemeEarly(): void {
  const STORAGE_KEY = 'lights-out-theme-settings'
  const settings = load<ThemeSettings>(STORAGE_KEY, DEFAULT_SETTINGS)
  const colors = getEarlyThemeColors(settings.colorTheme)

  applyThemeColors(colors)

  const bgColor = colors['--theme-bg']
  const fgColor = colors['--theme-fg']
  document.body.style.backgroundColor = bgColor
  document.body.style.color = fgColor
}

initializeThemeEarly()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>,
)
