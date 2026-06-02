import { wrapWithAudioProvider } from '@games/audio-engine'
import ReactDOM from 'react-dom/client'
import { App } from './ui/organisms/App'
import './styles.css'

const AppWithAudio = wrapWithAudioProvider(App)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithAudio />
  </React.StrictMode>,
)
