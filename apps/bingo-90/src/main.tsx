import ReactDOM from 'react-dom/client';
import { wrapWithAudioProvider } from '@games/audio-engine';
import App from './App';
import './styles.css';

const AppWithAudio = wrapWithAudioProvider(App);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithAudio />
  </React.StrictMode>
);
