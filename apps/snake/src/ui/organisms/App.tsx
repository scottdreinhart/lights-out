import { useSnakeApp } from '@/app'

import { SnakeSurface } from './SnakeSurface'

export default function App() {
  const app = useSnakeApp()

  return <SnakeSurface app={app} />
}
