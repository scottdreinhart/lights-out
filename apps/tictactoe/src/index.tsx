/*
 * Tic-Tac-Toe Game
 * Copyright © 2026 Scott Reinhart. All Rights Reserved.
 * PROPRIETARY & CONFIDENTIAL
 * Unauthorized reproduction, distribution, or use is strictly prohibited.
 * See LICENSE file for full terms and conditions.
 */

import './styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { SoundProvider } from './app/SoundContext'
import { ThemeProvider } from './app/ThemeContext'
import { ErrorBoundary } from './ui/atoms/ErrorBoundary'
import App from './ui/organisms/App'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </SoundProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

/* ── Service Worker registration (anti-cache mode disables it) ─────────── */
if ('serviceWorker' in navigator) {
  if (import.meta.env.VITE_NO_CACHE === 'true') {
    // Anti-cache: unregister all SWs and purge all caches
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => registrations.forEach((r) => r.unregister()))
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
    })
  }
}
