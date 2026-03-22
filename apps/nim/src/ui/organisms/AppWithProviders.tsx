/**
 * AppWithProviders — Wraps App with Ionic shell and context providers (Theme, Sound, I18n).
 * This is lazy-loaded by ShellApp, so heavy initialization is deferred.
 *
 * The IonApp wrapper provides:
 * - Cross-platform UI primitives (IonModal, IonAlert, IonToast, IonPopover, etc.)
 * - Platform detection (mobile, tablet, desktop, iOS, Android)
 * - Gesture handling (swipe, long-press, drag)
 * - Responsive layout adapting to 5 device tiers
 * - Keyboard handling (back button, hardware gestures on mobile)
 * - Touch optimization (hover fallbacks, pointer type detection)
 *
 * Structure:
 * IonApp → I18nProvider → ThemeProvider → SoundProvider → ErrorBoundary → App
 *
 * Do NOT remove IonApp; it's required for Ionic components to function.
 * Do NOT place Ionic components outside of IonApp.
 */

import { IonApp } from '@ionic/react'

import { I18nProvider, SoundProvider, ThemeProvider } from '@/app'
import { ErrorBoundary } from '@/ui'

import App from './App'

export default function AppWithProviders() {
  return (
    <IonApp>
      <I18nProvider>
        <ThemeProvider>
          <SoundProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </SoundProvider>
        </ThemeProvider>
      </I18nProvider>
    </IonApp>
  )
}
