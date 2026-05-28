import { useVectorAssaultApp } from '@/app'

import { VectorAssaultSurface } from './VectorAssaultSurface'

export const App = () => {
  const app = useVectorAssaultApp()

  return <VectorAssaultSurface app={app} />
}
