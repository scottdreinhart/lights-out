import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AudioProvider } from '@games/audio-engine';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>
);