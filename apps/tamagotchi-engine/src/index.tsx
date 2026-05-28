// Sources: https://tamagotchi.fandom.com/wiki/Care and
// https://tamagotchi.fandom.com/wiki/Training
// This entry point keeps the UI shell lightweight and delegates simulation
// behavior to the domain layer.

import React from 'react'
import ReactDOM from 'react-dom/client'

import { TamagotchiApp } from '@/ui'
import { AudioProvider } from '@games/audio-engine'

import '@games/assets-shared/themes/neon-arcade.css'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioProvider>
      <TamagotchiApp />
    </AudioProvider>
  </React.StrictMode>,
)
