/**
 * Queens Game App
 * N-Queens puzzle solver
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { QueensGame } from './ui'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <QueensGame />
  </React.StrictMode>,
)
