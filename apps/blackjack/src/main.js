import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import { wrapWithAudioProvider } from '@games/audio-engine';
import App from './App';
import './styles.css';
const AppWithAudio = wrapWithAudioProvider(App);
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(AppWithAudio, {}) }));
