/**
 * ShellApp — Lightweight shell that renders splash immediately,
 * then lazy-loads the full app with providers.
 *
 * This speeds up initial render: splash shows during React init.
 */

import { lazy, Suspense } from 'react'

// Lazy-load the full app with providers (deferred until needed)
const AppWithProviders = lazy(() => import('./AppWithProviders'))

// Immediate splash fallback
function ImmediateSplash() {
  return (
    <div className="nim-splash">
      <div className="nim-splash__orb"></div>
      <div className="nim-splash__grid"></div>
      <div className="nim-splash__logo" aria-label="Nim">
        <div className="nim-splash__badge">
          <div className="nim-splash__emoji">🎯</div>
        </div>
        <h1 className="nim-splash__title">Nim</h1>
      </div>
    </div>
  )
}

export default function ShellApp() {
  return (
    <Suspense fallback={<ImmediateSplash />}>
      <AppWithProviders />
    </Suspense>
  )
}
