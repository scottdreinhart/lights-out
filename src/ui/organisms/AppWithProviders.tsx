import { SoundProvider, ThemeProvider } from '@/app'

import App from './App'
import { ErrorBoundary } from './ErrorBoundary'

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </SoundProvider>
    </ThemeProvider>
  )
}
