// Platform contracts and types
export * from './contracts/index'

// Platform detection and DI
export { detectPlatform, type DetectedPlatform } from './detection'
export { resetPlatformApi, resolvePlatformApi } from './resolvePlatformApi'

// Platform adapters (core implementations)
export { createBrowserPlatformApi } from './adapters/browser/index'
export { createCapacitorPlatformApi } from './adapters/capacitor/index'
export { createElectronPlatformApi } from './adapters/electron/index'

// Responsive platform capabilities
export { MEDIA_QUERIES, deriveResponsiveState } from './responsive'
export type { ResponsiveCapabilities, ResponsiveState } from './responsive'
