// Preload script — runs in a sandboxed renderer context.
// Exposes a minimal bridge between the Electron main process and the web app.
// Currently no APIs are exposed — the app runs as a pure web app.

import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
});
