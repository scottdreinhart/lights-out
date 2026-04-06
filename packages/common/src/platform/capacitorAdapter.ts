/**
 * Capacitor Platform Adapter
 *
 * Provides conditional, safe access to Capacitor APIs.
 * Capacitor is optional for web builds but available for native (Android/iOS) and Electron builds.
 *
 * All imports are lazy-loaded with dynamic imports to prevent Vite/Rolldown from
 * resolving them at build time. This enables web-only builds to succeed without
 * requiring Capacitor packages in the bundle.
 *
 * Usage:
 * ```typescript
 * import { capacitor } from '@games/common'
 *
 * if (capacitor.isNativePlatform()) {
 *   await capacitor.hideSplashScreen()
 * }
 * ```
 */

/**
 * Safe wrapper for Capacitor APIs
 * Returns null on web when Capacitor is unavailable
 */
class CapacitorAdapter {
  private initialized = false
  private cachedIsNativePlatform: boolean | null = null

  /**
   * Check if running on native platform (Android/iOS via Capacitor)
   * Checks at runtime (not build time) so web builds don't fail
   */
  isNativePlatform(): boolean {
    // Cache result to avoid repeated checks
    if (this.cachedIsNativePlatform !== null) {
      return this.cachedIsNativePlatform
    }

    try {
      // Check global Capacitor object (set by native bridge at runtime)
      // This only exists when running on native platforms via Capacitor
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const result = (window as any).Capacitor.isNativePlatform?.() ?? false
        this.cachedIsNativePlatform = result
        return result
      }
    } catch {
      // Silently fail - if Capacitor is not available, we're on web
    }

    this.cachedIsNativePlatform = false
    return false
  }

  /**
   * Check if Capacitor APIs are available at runtime
   */
  isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && (window as any).Capacitor !== undefined
    } catch {
      return false
    }
  }

  /**
   * Lazy-load Capacitor App module
   * Only loads on native platforms
   */
  async loadAppModule() {
    if (!this.isNativePlatform()) return null
    try {
      // Dynamic import with webpackIgnore prevents static resolution by bundler
      const mod = await import(/* webpackIgnore: true */ '@capacitor/app')
      return mod
    } catch {
      return null
    }
  }

  /**
   * Lazy-load Capacitor Device module
   * Only loads on native platforms
   */
  async loadDeviceModule() {
    if (!this.isNativePlatform()) return null
    try {
      const mod = await import(/* webpackIgnore: true */ '@capacitor/device')
      return mod
    } catch {
      return null
    }
  }

  /**
   * Lazy-load Capacitor Preferences module
   * Only loads on native platforms
   */
  async loadPreferencesModule() {
    if (!this.isNativePlatform()) return null
    try {
      const mod = await import(/* webpackIgnore: true */ '@capacitor/preferences')
      return mod
    } catch {
      return null
    }
  }

  /**
   * Lazy-load Capacitor Haptics module
   * Only loads on native platforms
   */
  async loadHapticsModule() {
    if (!this.isNativePlatform()) return null
    try {
      const mod = await import(/* webpackIgnore: true */ '@capacitor/haptics')
      return mod
    } catch {
      return null
    }
  }

  /**
   * Lazy-load Capacitor SplashScreen module
   * Only loads on native platforms
   */
  async loadSplashScreenModule() {
    if (!this.isNativePlatform()) return null
    try {
      const mod = await import(/* webpackIgnore: true */ '@capacitor/splash-screen')
      return mod
    } catch {
      return null
    }
  }

  /**
   * Lazy-load Capacitor Keyboard module
   * Only loads on native platforms
   */
  async loadKeyboardModule() {
    if (!this.isNativePlatform()) return null
    try {
      const mod = await import(/* webpackIgnore: true */ '@capacitor/keyboard')
      return mod
    } catch {
      return null
    }
  }

  /**
   * Initialize Capacitor on native platform
   * Safe to call on web (no-op)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    if (this.isNativePlatform()) {
      try {
        const appModule = await this.loadAppModule()
        if (appModule?.App) {
          // App is initialized automatically by Capacitor
          this.initialized = true
        }
      } catch (error) {
        console.warn('[Capacitor] Init failed:', error)
      }
    }
  }

  /**
   * Hide splash screen (native only)
   * No-op on web
   */
  async hideSplashScreen(): Promise<void> {
    if (!this.isNativePlatform()) return

    try {
      const splashModule = await this.loadSplashScreenModule()
      if (splashModule?.SplashScreen) {
        await splashModule.SplashScreen.hide()
      }
    } catch (error) {
      console.debug('[Capacitor] Could not hide splash screen:', error)
    }
  }

  /**
   * Get device info (native only)
   * Returns null on web
   */
  async getDeviceInfo(): Promise<any> {
    if (!this.isNativePlatform()) return null

    try {
      const deviceModule = await this.loadDeviceModule()
      if (deviceModule?.Device) {
        return await deviceModule.Device.getInfo()
      }
    } catch (error) {
      console.debug('[Capacitor] Could not get device info:', error)
    }

    return null
  }

  /**
   * Set persistent preference (native safe storage)
   * No-op on web
   */
  async setPreference(key: string, value: string): Promise<void> {
    if (!this.isNativePlatform()) return

    try {
      const prefsModule = await this.loadPreferencesModule()
      if (prefsModule?.Preferences) {
        await prefsModule.Preferences.set({ key, value })
      }
    } catch (error) {
      console.debug('[Capacitor] Could not set preference:', error)
    }
  }

  /**
   * Get persistent preference
   * Returns null if not found or on web
   */
  async getPreference(key: string): Promise<string | null> {
    if (!this.isNativePlatform()) return null

    try {
      const prefsModule = await this.loadPreferencesModule()
      if (prefsModule?.Preferences) {
        const result = await prefsModule.Preferences.get({ key })
        return result?.value ?? null
      }
    } catch (error) {
      console.debug('[Capacitor] Could not get preference:', error)
    }

    return null
  }

  /**
   * Trigger haptic feedback
   * No-op on web or if haptics unavailable
   */
  async triggerHaptic(duration?: number): Promise<void> {
    if (!this.isNativePlatform()) return

    try {
      const hapticsModule = await this.loadHapticsModule()
      if (hapticsModule?.Haptics) {
        await hapticsModule.Haptics.vibrate({ duration: duration ?? 100 })
      }
    } catch (error) {
      console.debug('[Capacitor] Could not trigger haptic:', error)
    }
  }

  /**
   * Show keyboard (iOS)
   * No-op on web or Android
   */
  async showKeyboard(): Promise<void> {
    if (!this.isNativePlatform()) return

    try {
      const keyboardModule = await this.loadKeyboardModule()
      if (keyboardModule?.Keyboard) {
        await keyboardModule.Keyboard.show()
      }
    } catch (error) {
      console.debug('[Capacitor] Could not show keyboard:', error)
    }
  }

  /**
   * Hide keyboard
   * No-op on web or if keyboard unavailable
   */
  async hideKeyboard(): Promise<void> {
    if (!this.isNativePlatform()) return

    try {
      const keyboardModule = await this.loadKeyboardModule()
      if (keyboardModule?.Keyboard) {
        await keyboardModule.Keyboard.hide()
      }
    } catch (error) {
      console.debug('[Capacitor] Could not hide keyboard:', error)
    }
  }
}

/**
 * Singleton instance
 * Safe to use on web, native, and Electron
 */
export const capacitor = new CapacitorAdapter()

/**
 * Type export for TypeScript
 */
export type { CapacitorAdapter }
