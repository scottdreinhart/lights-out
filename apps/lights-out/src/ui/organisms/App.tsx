import { useLightsOutApp } from '@/app'

import { LightsOutSurface } from './LightsOutSurface'

export default function App() {
  const app = useLightsOutApp()

  return <LightsOutSurface app={app} />
}
