import React from 'react'

export default function App(): JSX.Element {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>{{name}}</h1>
      <p>Electron-Vite app running</p>
      <p>Platform: {window.navigator.platform}</p>
    </div>
  )
}
