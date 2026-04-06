/**
 * UI Theme Service — handles DOM synchronization and UI-specific theme logic.
 * This service is part of the UI layer and can import UI constants and do DOM manipulation.
 */

import { createSharedThemeLoaders } from '@games/assets-shared'
import { SHARED_THEME_COLORS } from '@games/domain-shared'

import type { ThemeSettings } from '@/domain'
import { getBackgroundCssValue, preloadAllSprites } from '@/assets/sprites'
import { COLOR_THEMES, getLayerStack, layerStackToCssVars } from '@/ui'

const themeLoaders = createSharedThemeLoaders()

let activeThemeStyle: HTMLStyleElement | null = null
const preloadedThemes = new Map<string, string>()

/**
 * Preload a specific theme CSS file.
 */
const preloadTheme = async (themeId: string): Promise<void> => {
  if (preloadedThemes.has(themeId) || themeId === 'classic') {
    return
  }

  const loader = themeLoaders[`../themes/${themeId}.css`]
  if (loader) {
    try {
      const css = await loader()
      preloadedThemes.set(themeId, css)
    } catch {
      // Theme file not found — skip preload
    }
  }
}

/**
 * Preload all available themes.
 */
export const preloadAllThemes = (): void => {
  COLOR_THEMES.forEach(({ id }) => {
    if (id !== 'classic') {
      preloadTheme(id).catch(() => {})
    }
  })
}

/**
 * Apply theme CSS to the document head.
 */
const applyThemeCSS = async (themeId: string): Promise<void> => {
  if (activeThemeStyle) {
    activeThemeStyle.remove()
    activeThemeStyle = null
  }

  if (themeId === 'classic') {
    return
  }

  let css = preloadedThemes.get(themeId)
  if (!css) {
    const loader = themeLoaders[`../themes/${themeId}.css`]
    if (!loader) {
      return
    }
    css = await loader()
  }

  const el = document.createElement('style')
  el.setAttribute('data-theme-chunk', themeId)
  el.textContent = css
  document.head.appendChild(el)
  activeThemeStyle = el
}

/**
 * Apply theme settings to the DOM.
 */
export const applyThemeToDOM = async (settings: ThemeSettings): Promise<void> => {
  const root = document.documentElement

  root.setAttribute('data-theme', settings.colorTheme)

  if (settings.mode === 'system') {
    root.removeAttribute('data-mode')
  } else {
    root.setAttribute('data-mode', settings.mode)
  }

  if (settings.colorblind === 'none') {
    root.removeAttribute('data-colorblind')
  } else {
    root.setAttribute('data-colorblind', settings.colorblind)
  }

  // Sprite Manager — set background image from central registry
  root.style.setProperty('--bg-image', getBackgroundCssValue(settings.colorTheme))

  // Layer Manager — apply layer stack CSS custom properties
  const layerVars = layerStackToCssVars(getLayerStack(settings.colorTheme))
  for (const [prop, value] of Object.entries(layerVars)) {
    root.style.setProperty(prop, value)
  }

  // Theme Colors — apply color palette CSS custom properties
  const themeColors = SHARED_THEME_COLORS[settings.colorTheme] ?? SHARED_THEME_COLORS.classic
  for (const [prop, value] of Object.entries(themeColors)) {
    root.style.setProperty(prop, value)
  }

  // Apply theme CSS
  await applyThemeCSS(settings.colorTheme)
}

/**
 * Initialize theme system (preload assets).
 */
export const initializeThemeSystem = (): void => {
  preloadAllThemes()
  preloadAllSprites()
}