import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  // Expose API here if needed
  platform: process.platform,
  arch: process.arch
})

export {}
