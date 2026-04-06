import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppShell } from './AppShell'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>,
)
