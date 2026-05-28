import { useMinesweeperApp } from '@/app'

import { MinesweeperSurface } from './MinesweeperSurface'

export function App() {
  const app = useMinesweeperApp()

  return <MinesweeperSurface app={app} />
}
