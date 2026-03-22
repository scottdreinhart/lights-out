import { contextBridge, ipcRenderer } from 'electron';

/**
 * Secure API exposed to renderer process via contextBridge (sandboxed)
 * 
 * Usage in React:
 *   const version = await window.electronAPI.getVersion()
 *   const platform = window.electronAPI.platform
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Platform information (read-only)
   */
  platform: process.platform,
  isElectron: true,
  isDev: !window.location.origin.startsWith('app://'), // Heuristic: file:// = packaged, http = dev

  /**
   * IPC invocations to main process
   */
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  getAppPath: () => ipcRenderer.invoke('app:getAppPath'),

  /**
   * Window controls (optional, for custom titlebar etc)
   */
  windowMinimize: () => ipcRenderer.invoke('window:minimize'),
  windowMaximize: () => ipcRenderer.invoke('window:maximize'),
  windowClose: () => ipcRenderer.invoke('window:close'),

  /**
   * Logging (route to main process where file logging could happen)
   */
  log: (message, level = 'info') => ipcRenderer.send('app:log', { message, level }),
});
