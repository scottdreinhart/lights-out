/**
 * Queens Game App
 * N-Queens puzzle solver
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueensGame } from './ui'
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <QueensGame />
  </React.StrictMode>
)