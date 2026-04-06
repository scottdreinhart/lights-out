import './styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

const App = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Speed Bingo</h1>
    <p>Coming soon...</p>
  </div>
)

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
