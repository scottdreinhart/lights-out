import { describe, expect, it } from 'vitest'

import { deriveResponsiveState } from '@/domain'

const makeResponsiveState = (options: {
  width: number
  height: number
  supportsHover?: boolean
  hasCoarsePointer?: boolean
  prefersReducedMotion?: boolean
  prefersDarkColorScheme?: boolean
}) =>
  deriveResponsiveState({
    width: options.width,
    height: options.height,
    isPortrait: options.height > options.width,
    isLandscape: options.width >= options.height,
    supportsHover: options.supportsHover ?? true,
    hasCoarsePointer: options.hasCoarsePointer ?? false,
    hasFinePointer: !(options.hasCoarsePointer ?? false),
    prefersReducedMotion: options.prefersReducedMotion ?? false,
    prefersDarkColorScheme: options.prefersDarkColorScheme ?? false,
  })

describe('deriveResponsiveState', () => {
  it('handles a small portrait touch viewport', () => {
    const state = makeResponsiveState({
      width: 390,
      height: 844,
      supportsHover: false,
      hasCoarsePointer: true,
    })

    expect(state.isMobile).toBe(true)
    expect(state.isPortrait).toBe(true)
    expect(state.compactViewport).toBe(true)
    expect(state.fullscreenDialogPreferred).toBe(true)
    expect(state.gridColumns).toBe(1)
  })

  it('treats small landscape as compact and short-height', () => {
    const state = makeResponsiveState({
      width: 740,
      height: 360,
      supportsHover: false,
      hasCoarsePointer: true,
    })

    expect(state.isLandscape).toBe(true)
    expect(state.shortViewport).toBe(true)
    expect(state.compactViewport).toBe(true)
    expect(state.contentDensity).toBe('compact')
  })

  it('identifies tablet portrait and keeps a two-column layout when space allows', () => {
    const state = makeResponsiveState({
      width: 834,
      height: 1112,
      supportsHover: false,
      hasCoarsePointer: true,
    })

    expect(state.isTablet).toBe(true)
    expect(state.touchOptimized).toBe(true)
    expect(state.gridColumns).toBe(2)
  })

  it('keeps large touch layouts touch-optimized even at laptop-like widths', () => {
    const state = makeResponsiveState({
      width: 1366,
      height: 1024,
      supportsHover: false,
      hasCoarsePointer: true,
    })

    expect(state.wideViewport).toBe(false)
    expect(state.touchOptimized).toBe(true)
    expect(state.denseLayoutAllowed).toBe(false)
    expect(state.gridColumns).toBe(2)
  })

  it('treats a narrow desktop window as desktop-capable without forcing touch patterns', () => {
    const state = makeResponsiveState({
      width: 900,
      height: 900,
      supportsHover: true,
      hasCoarsePointer: false,
    })

    expect(state.isDesktop).toBe(true)
    expect(state.isTablet).toBe(false)
    expect(state.touchOptimized).toBe(false)
    expect(state.compactViewport).toBe(false)
  })

  it('enables dense layouts for standard desktop conditions', () => {
    const state = makeResponsiveState({
      width: 1280,
      height: 900,
      supportsHover: true,
      hasCoarsePointer: false,
    })

    expect(state.isDesktop).toBe(true)
    expect(state.denseLayoutAllowed).toBe(true)
    expect(state.contentDensity).toBe('spacious')
  })

  it('switches to sidebar mode for ultrawide desktop layouts', () => {
    const state = makeResponsiveState({
      width: 1800,
      height: 1024,
      supportsHover: true,
      hasCoarsePointer: false,
    })

    expect(state.wideViewport).toBe(true)
    expect(state.ultrawideViewport).toBe(true)
    expect(state.navMode).toBe('sidebar')
  })

  it('disables dense mode when reduced motion is preferred', () => {
    const state = makeResponsiveState({
      width: 1440,
      height: 900,
      supportsHover: true,
      hasCoarsePointer: false,
      prefersReducedMotion: true,
    })

    expect(state.prefersReducedMotion).toBe(true)
    expect(state.contentDensity).toBe('standard')
    expect(state.denseLayoutAllowed).toBe(true)
  })

  it('marks short-height desktop layouts as fullscreen-dialog friendly', () => {
    const state = makeResponsiveState({
      width: 1280,
      height: 650,
      supportsHover: true,
      hasCoarsePointer: false,
    })

    expect(state.shortViewport).toBe(true)
    expect(state.fullscreenDialogPreferred).toBe(true)
    expect(state.contentDensity).toBe('compact')
  })

  it('respects exact breakpoint boundaries', () => {
    const mdState = makeResponsiveState({ width: 600, height: 1024 })
    const lgState = makeResponsiveState({ width: 900, height: 1024 })
    const xlState = makeResponsiveState({ width: 1200, height: 1024 })

    expect(mdState.isMd).toBe(true)
    expect(mdState.isSm).toBe(false)
    expect(lgState.isLg).toBe(true)
    expect(lgState.isMd).toBe(false)
    expect(xlState.isXl).toBe(true)
    expect(xlState.isLg).toBe(false)
  })

  it('avoids contradictory mobile and desktop states', () => {
    const touchState = makeResponsiveState({
      width: 430,
      height: 932,
      supportsHover: false,
      hasCoarsePointer: true,
    })
    const desktopState = makeResponsiveState({
      width: 1600,
      height: 900,
      supportsHover: true,
      hasCoarsePointer: false,
    })

    expect(touchState.isMobile && touchState.isDesktop).toBe(false)
    expect(desktopState.isMobile && desktopState.isDesktop).toBe(false)
    expect(desktopState.isTablet && desktopState.isDesktop).toBe(false)
  })
})
