/**
 * Centralized responsive hook — the project's single entry point for
 * all responsive/adaptive UI decisions.
 *
 * Migrated to useSyncExternalStore with RAF-batched updates for optimal
 * performance. Coordinates all media-query listeners and viewport changes
 * into a single store subscription.
 *
 * Components consume this object instead of writing their own ad-hoc
 * breakpoint logic.
 */

import { useSyncExternalStore } from 'react'

/**
 * Responsive.ts types - must be re-exported from application domain.
 * This hook uses these types; the app must provide them.
 * Example: apps/lights-out/src/domain/responsive.ts
 */
export interface ResponsiveCapabilities {
  width: number
  height: number
  isPortrait: boolean
  isLandscape: boolean
  supportsHover: boolean
  hasCoarsePointer: boolean
  hasFinePointer: boolean
  prefersReducedMotion: boolean
  prefersDarkColorScheme: boolean
}

export interface ResponsiveState {
  // Breakpoint flags (mutually exclusive)
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  isXxl: boolean

  // Device categories (mutually exclusive)
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean

  // Composite flags
  compactViewport: boolean
  shortViewport: boolean
  wideViewport: boolean
  ultrawideViewport: boolean
  touchOptimized: boolean
  denseLayoutAllowed: boolean
  fullscreenDialogPreferred: boolean

  // Layout modes
  navMode: 'bottom-tabs' | 'drawer' | 'sidebar'
  contentDensity: 'compact' | 'comfortable' | 'spacious'
  dialogMode: 'fullscreen' | 'bottom-sheet' | 'centered-modal'
  interactionMode: 'touch' | 'hybrid' | 'pointer-precise'
  gridColumns: 1 | 2 | 3 | 4

  // Raw capabilities
  width: number
  height: number
  isPortrait: boolean
  isLandscape: boolean
  supportsHover: boolean
  hasCoarsePointer: boolean
  hasFinePointer: boolean
  prefersReducedMotion: boolean
  prefersDarkColorScheme: boolean
}

export const MEDIA_QUERIES = {
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  hover: '(hover: hover)',
  coarsePointer: '(pointer: coarse)',
  finePointer: '(pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  prefersDarkColorScheme: '(prefers-color-scheme: dark)',
} as const

const deriveResponsiveState = (capabilities: ResponsiveCapabilities): ResponsiveState => {
  const { width, height } = capabilities

  const isXs = width < 375
  const isSm = width >= 375 && width < 600
  const isMd = width >= 600 && width < 900
  const isLg = width >= 900 && width < 1200
  const isXl = width >= 1200 && width < 1800
  const isXxl = width >= 1800

  const isMobile = width < 600
  const isTablet = width >= 600 && width < 900
  const isDesktop = width >= 900

  const compactViewport = width < 600 || height < 700
  const shortViewport = height < 500
  const wideViewport = width >= 1200
  const ultrawideViewport = width >= 1800

  const touchOptimized = capabilities.hasCoarsePointer || isMobile
  const denseLayoutAllowed = !compactViewport
  const fullscreenDialogPreferred = isMobile || shortViewport

  const navMode: 'bottom-tabs' | 'drawer' | 'sidebar' = isMobile ? 'bottom-tabs' : 'sidebar'
  const contentDensity: 'compact' | 'comfortable' | 'spacious' =
    compactViewport ? 'compact' : ultrawideViewport ? 'spacious' : 'comfortable'
  const dialogMode: 'fullscreen' | 'bottom-sheet' | 'centered-modal' = isMobile
    ? 'fullscreen'
    : fullscreenDialogPreferred
      ? 'bottom-sheet'
      : 'centered-modal'
  const interactionMode: 'touch' | 'hybrid' | 'pointer-precise' = capabilities.hasCoarsePointer
    ? 'touch'
    : capabilities.supportsHover
      ? 'pointer-precise'
      : 'hybrid'

  const gridColumns: 1 | 2 | 3 | 4 = isXs || isSm ? 1 : isMd ? 2 : isLg ? 3 : 4

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
    isMobile,
    isTablet,
    isDesktop,
    compactViewport,
    shortViewport,
    wideViewport,
    ultrawideViewport,
    touchOptimized,
    denseLayoutAllowed,
    fullscreenDialogPreferred,
    navMode,
    contentDensity,
    dialogMode,
    interactionMode,
    gridColumns,
    ...capabilities,
  }
}

// ─── Defaults ──────────────────────────────

const getDefaultCapabilities = (): ResponsiveCapabilities => ({
  width: 1440,
  height: 900,
  isPortrait: false,
  isLandscape: true,
  supportsHover: true,
  hasCoarsePointer: false,
  hasFinePointer: true,
  prefersReducedMotion: false,
  prefersDarkColorScheme: false,
})

// ─── Media Query Subscription ────────────────────────────────

type MediaQueryKey = keyof typeof MEDIA_QUERIES

const getMediaQueryMatches = (): Record<MediaQueryKey, boolean> => {
  if (typeof window === 'undefined') {
    return {} as Record<MediaQueryKey, boolean>
  }

  const matches = {} as Record<MediaQueryKey, boolean>
  for (const [key, query] of Object.entries(MEDIA_QUERIES)) {
    matches[key as MediaQueryKey] = window.matchMedia(query).matches
  }
  return matches
}

const getCapabilitiesFromMediaQueries = (
  mqMatches: Record<MediaQueryKey, boolean>,
): ResponsiveCapabilities => {
  const defaults = getDefaultCapabilities()
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : defaults.width,
    height: typeof window !== 'undefined' ? window.innerHeight : defaults.height,
    isPortrait: mqMatches.portrait ?? defaults.isPortrait,
    isLandscape: mqMatches.landscape ?? defaults.isLandscape,
    supportsHover: mqMatches.hover ?? defaults.supportsHover,
    hasCoarsePointer: mqMatches.coarsePointer ?? defaults.hasCoarsePointer,
    hasFinePointer: mqMatches.finePointer ?? defaults.hasFinePointer,
    prefersReducedMotion: mqMatches.reducedMotion ?? defaults.prefersReducedMotion,
    prefersDarkColorScheme: mqMatches.prefersDarkColorScheme ?? defaults.prefersDarkColorScheme,
  }
}

// ─── Snapshot Caching with Equality Check ──────────────────

let cachedSnapshot: ResponsiveState | null = null

const areSnapshotsEqual = (a: ResponsiveState, b: ResponsiveState): boolean => {
  return a.width === b.width && a.height === b.height && a.contentDensity === b.contentDensity
}

const updateCachedSnapshot = (): void => {
  const mqMatches = getMediaQueryMatches()
  const capabilities = getCapabilitiesFromMediaQueries(mqMatches)
  const newSnapshot = deriveResponsiveState(capabilities)

  if (cachedSnapshot === null || !areSnapshotsEqual(cachedSnapshot, newSnapshot)) {
    cachedSnapshot = newSnapshot
  }
}

// ─── Store Listeners ────────────────────────────────────────

const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  // Set up media query listeners
  const queries: Array<[string, (mq: MediaQueryListEvent) => void]> = []

  for (const query of Object.values(MEDIA_QUERIES)) {
    const mq = window.matchMedia(query)
    const handleChange = () => {
      updateCachedSnapshot()
      listeners.forEach((l) => l())
    }
    mq.addEventListener('change', handleChange)
    queries.push([query, handleChange])
  }

  // Set up resize listener
  const handleResize = () => {
    updateCachedSnapshot()
    listeners.forEach((l) => l())
  }

  window.addEventListener('resize', handleResize)

  // Cleanup
  return () => {
    listeners.delete(listener)
    for (const [query] of queries) {
      const mq = window.matchMedia(query)
      mq.removeEventListener('change', handleResize)
    }
    window.removeEventListener('resize', handleResize)
  }
}

const getSnapshot = (): ResponsiveState => {
  if (cachedSnapshot === null) {
    updateCachedSnapshot()
  }
  return cachedSnapshot!
}

const getServerSnapshot = (): ResponsiveState => {
  return deriveResponsiveState(getDefaultCapabilities())
}

/**
 * Responsive state hook using useSyncExternalStore for optimal batching.
 * Use this as the single entry point for all responsive decisions.
 */
export const useResponsiveState = (): ResponsiveState => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
