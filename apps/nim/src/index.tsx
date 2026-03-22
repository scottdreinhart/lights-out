import React from 'react'
import ReactDOM from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { setupIonicReact } from '@ionic/react'
import { SHARED_THEME_COLORS } from '@games/domain-shared'

import type { ThemeSettings } from '@/domain'
import { load } from '@/infrastructure/storage'
import { ErrorBoundary, ShellApp } from '@/ui'
import { DEFAULT_SETTINGS } from '@/ui/theme/themeRegistry'
import './styles.css'
import 'flag-icons/css/flag-icons.min.css'


/**
 * Initialize theme from localStorage BEFORE React renders
 * Ensures SplashScreen displays correct colors immediately
 */
function initializeThemeEarly(): void {
  const STORAGE_KEY = 'nim-theme-settings'
  const settings = load<ThemeSettings>(STORAGE_KEY, DEFAULT_SETTINGS)
  const themeId = settings.colorTheme
  const colors = SHARED_THEME_COLORS[themeId] || SHARED_THEME_COLORS.classic

  // Apply theme CSS custom properties to root element
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // Apply background and foreground colors to body for splash screen
  const bgColor = colors['--theme-bg'] || '#000000'
  const fgColor = colors['--theme-fg'] || '#e0e0e0'
  document.body.style.backgroundColor = bgColor
  document.body.style.color = fgColor
}

/**
 * Ionic React CSS imports (core UI framework)
 * These provide cross-platform styles for mobile, tablet, desktop
 */
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/display.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/flex-utils.css'

/**
 * Initialize theme BEFORE Ionic and React rendering
 * Ensures SplashScreen displays persisted theme colors immediately
 */
initializeThemeEarly()

/**
 * Initialize Ionic React
 * Configures platform detection, gesture handling, and responsive behavior
 */
setupIonicReact()

// Initialize Capacitor bridge
if (Capacitor.isNativePlatform()) {
  // Hide splash screen after brief delay (app is rendering)
  setTimeout(() => {
    SplashScreen.hide().catch((err) => {
      console.warn('SplashScreen already hidden', err)
    })
  }, 500)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      onError={(error, info) => {
        // Error logged in ErrorBoundary component; can enhance with crashLogger
        console.error('React Error Boundary', error.message, info)
      }}
    >
      <ShellApp />
    </ErrorBoundary>
  </React.StrictMode>,
)
