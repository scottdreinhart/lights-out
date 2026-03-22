/**
 * TypeScript type definitions for Electron preload API
 * Exposed via contextBridge in preload.js
 *
 * Usage:
 *   import type { ElectronAPI } from '@/electron/types'
 *   declare global {
 *     interface Window {
 *       electronAPI: ElectronAPI
 *     }
 *   }
 */

export interface ElectronAPI {
  /**
   * Platform information (read-only)
   */
  readonly platform: 'linux' | 'darwin' | 'win32'
  readonly isElectron: boolean
  readonly isDev: boolean

  /**
   * App information via IPC
   */
  getVersion(): Promise<string>
  getPlatform(): Promise<string>
  getAppPath(): Promise<string>

  /**
   * Window controls via IPC
   */
  windowMinimize(): Promise<void>
  windowMaximize(): Promise<void>
  windowClose(): Promise<void>

  /**
   * Logging via IPC
   */
  log(message: string, level?: 'info' | 'warn' | 'error'): void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
