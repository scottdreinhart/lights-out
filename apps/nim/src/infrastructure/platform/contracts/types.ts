/**
 * PlatformApi Contracts — Typed boundaries for all platform-specific capabilities
 *
 * Single source of truth for what platforms can do. All implementations
 * (browser, electron, capacitor) provide these interfaces.
 *
 * Usage: const platform = resolvePlatformApi(); platform.haptics.light()
 */

// ─── Haptics (Vibration) ──────────────────────────────

export interface HapticsApi {
  light(): Promise<void>
  medium(): Promise<void>
  heavy(): Promise<void>
}

// ─── Storage (Persistence) ──────────────────────────────

export interface StorageApi {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
}

// ─── Diagnostics (Logging & Analytics) ──────────────────────────────

export interface DiagnosticsApi {
  logError(message: string, context?: Record<string, any>): void
  logWarning(message: string): void
  logInfo(message: string): void
  trackEvent(eventName: string, data?: Record<string, any>): void
}

// ─── Audio (Sound Effects & Music) ──────────────────────────────

export interface AudioApi {
  play(soundId: string): Promise<void>
  stop(soundId: string): Promise<void>
  setVolume(level: number): void
}

// ─── Device (Platform Information) ──────────────────────────────

export interface DeviceInfo {
  userAgent: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  supportsHaptics: boolean
  supportsNotifications: boolean
}

export interface DeviceApi {
  isOnline(): boolean
  getDeviceInfo(): DeviceInfo
  onOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void
}

// ─── Platform Union ──────────────────────────────

/**
 * PlatformApi: DI container for all platform capabilities
 *
 * Implementations:
 * - 'web': Browser-based (Vibration API, localStorage, etc.)
 * - 'electron': Desktop Electron (native modules, file system access)
 * - 'capacitor': Mobile (Capacitor plugins for iOS/Android)
 */
export interface PlatformApi {
  haptics: HapticsApi
  storage: StorageApi
  diagnostics: DiagnosticsApi
  audio: AudioApi
  device: DeviceApi
  name: 'web' | 'electron' | 'capacitor'
}
