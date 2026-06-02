import { useCheckersGame } from '@/app'

import { CheckersSurface } from './CheckersSurface'

export function App() {
  return <CheckersComposer />
}

function CheckersComposer() {
  const game = useCheckersGame()

  return <CheckersSurface game={game} />
}

export default App
