import React from 'react'
import ReactDOM from 'react-dom/client'

import { ThemeProvider } from '@/app'
import { App } from '@/ui/organisms'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
