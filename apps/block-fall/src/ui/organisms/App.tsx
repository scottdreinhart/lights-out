import { useBlockFallApp } from '@/app'

import { BlockFallSurface } from './BlockFallSurface'

export const App = () => {
  const app = useBlockFallApp()

  return <BlockFallSurface app={app} />
}
