import { App } from '@/ui'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { animationsModule } from '@games/ui-utils'
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
