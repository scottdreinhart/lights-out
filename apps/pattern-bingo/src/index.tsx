import React from 'react'
import ReactDOM from 'react-dom/client'

import { ThemeProvider } from '@/app'
import { ErrorBoundary } from '@/ui/atoms'
import { App } from '@/ui/organisms'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>,
)
