import { useReversiApp } from '@/app'

import { ReversiSurface } from './ReversiSurface'

export function App() {
  return <ReversiComposer />
}

function ReversiComposer() {
  const game = useReversiApp()

  return <ReversiSurface game={game} />
}

export default App
