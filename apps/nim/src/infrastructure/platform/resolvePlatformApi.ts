/**
 * Platform API Dependency Injection Container
 * Resolves and caches the appropriate PlatformApi implementation
 */

import { createBrowserPlatformApi } from './adapters/browser/index'
import { createCapacitorPlatformApi } from './adapters/capacitor/index'
import { createElectronPlatformApi } from './adapters/electron/index'
import type { PlatformApi } from './contracts/types'
import { detectPlatform } from './detection'

let _platformApi: PlatformApi | null = null

/**
 * Resolve and cache the PlatformApi for the current runtime
 * Safe to call multiple times; returns cached instance after first call
 */
export function resolvePlatformApi(): PlatformApi {
  if (_platformApi) {
    return _platformApi
  }

  const platform = detectPlatform()

  switch (platform) {
    case 'electron':
      _platformApi = createElectronPlatformApi()
      break

    case 'capacitor':
      _platformApi = createCapacitorPlatformApi()
      break

    case 'web':
    default:
      _platformApi = createBrowserPlatformApi()
      break
  }

  return _platformApi
}

/**
 * Reset the cached platform API (useful for testing or platform switches)
 */
export function resetPlatformApi(): void {
  _platformApi = null
}
