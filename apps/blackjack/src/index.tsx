import { SoundProvider } from '@games/sound-context'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { App } from './ui/organisms/App'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <SoundProvider>
      <App />
    </SoundProvider>
  </React.StrictMode>,
)
