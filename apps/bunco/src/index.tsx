import { SoundProvider, ThemeProvider } from '@/app'
import { ErrorBoundary } from '@/ui/atoms'
import { App } from '@/ui/organisms'
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
