import { SoundProvider, ThemeProvider } from '@/app'
import { App, ErrorBoundary } from '@/ui'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
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
