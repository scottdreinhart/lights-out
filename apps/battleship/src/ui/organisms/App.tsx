import { useBattleshipApp } from '@/app'

import { BattleshipSurface } from './BattleshipSurface'

export default function App() {
  const game = useBattleshipApp()

  return <BattleshipSurface game={game} />
}
