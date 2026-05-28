import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { PinpointGame } from './ui/PinpointGame'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PinpointGame />
  </React.StrictMode>,
)
