/**
 * Zip Game Entry Point
 * Main application entry for the Zip maze navigation puzzle
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ZipGame } from './ui'
import './styles.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <ZipGame />
  </React.StrictMode>
)