import './styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { SoundProvider, ThemeProvider } from '@/app'
import { ErrorBoundary } from '@/ui/atoms'
import { App } from '@/ui/organisms'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(root).render(
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
