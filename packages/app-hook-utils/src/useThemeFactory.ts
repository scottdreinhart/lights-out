import { useCallback, useEffect, useState } from 'react'

type ThemeLoader = () => Promise<string>
type ThemeLoaderMap = Record<string, ThemeLoader>

export interface ThemeSettingsShape {
	colorTheme: string
	mode: string
	colorblind: string
}

interface CreateUseThemeConfig<TThemeSettings extends ThemeSettingsShape> {
	storageKey: string
	defaultSettings: TThemeSettings
	colorThemes: readonly { id: string }[] | readonly string[]
	themeColors: Record<string, Record<string, string>>
	createThemeLoaders: () => ThemeLoaderMap
	load: (key: string, fallback: TThemeSettings) => TThemeSettings | null | undefined
	save: (key: string, value: TThemeSettings) => void
	getLayerStack: (colorTheme: string) => Record<string, number>
	layerStackToCssVars: (stack: Record<string, number>) => Record<string, string>
	getBackgroundCssValue: (colorTheme: string) => string
	preloadAllSprites: () => void
}

export interface UseThemeResult<TThemeSettings extends ThemeSettingsShape> {
	settings: TThemeSettings
	setColorTheme: (id: string) => void
	setMode: (mode: string) => void
	setColorblind: (id: string) => void
}

export const createUseThemeHook = <TThemeSettings extends ThemeSettingsShape>({
	storageKey,
	defaultSettings,
	colorThemes,
	themeColors,
	createThemeLoaders,
	load,
	save,
	getLayerStack,
	layerStackToCssVars,
	getBackgroundCssValue,
	preloadAllSprites,
}: CreateUseThemeConfig<TThemeSettings>): (() => UseThemeResult<TThemeSettings>) => {
	const colorThemeIds = colorThemes.map((theme) => (typeof theme === 'string' ? theme : theme.id))
	const themeLoaders = createThemeLoaders()
	let activeThemeStyle: HTMLStyleElement | null = null
	const preloadedThemes = new Map<string, string>()

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

	const preloadAllThemes = (): void => {
		colorThemeIds.forEach((id) => {
			if (id !== 'classic') {
				preloadTheme(id).catch(() => {})
			}
		})
	}

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

	const loadSettings = (): TThemeSettings => {
		const parsed = load(storageKey, defaultSettings)
		return { ...defaultSettings, ...parsed }
	}

	const saveSettings = (settings: TThemeSettings): void => {
		save(storageKey, settings)
	}

	const applyToDOM = (settings: TThemeSettings): void => {
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

		root.style.setProperty('--bg-image', getBackgroundCssValue(settings.colorTheme))

		const layerVars = layerStackToCssVars(getLayerStack(settings.colorTheme))
		for (const [prop, value] of Object.entries(layerVars)) {
			root.style.setProperty(prop, value)
		}

		const colors = themeColors[settings.colorTheme] ?? themeColors.classic
		for (const [prop, value] of Object.entries(colors)) {
			root.style.setProperty(prop, value)
		}
	}

	return () => {
		const [settings, setSettings] = useState<TThemeSettings>(loadSettings)

		useEffect(() => {
			preloadAllThemes()
			preloadAllSprites()
		}, [])

		useEffect(() => {
			applyToDOM(settings)
			applyThemeCSS(settings.colorTheme)
			saveSettings(settings)
		}, [settings])

		const setColorTheme = useCallback((id: string) => {
			setSettings((prev) => ({ ...prev, colorTheme: id }))
		}, [])

		const setMode = useCallback((mode: string) => {
			setSettings((prev) => ({ ...prev, mode }))
		}, [])

		const setColorblind = useCallback((id: string) => {
			setSettings((prev) => ({ ...prev, colorblind: id }))
		}, [])

		return { settings, setColorTheme, setMode, setColorblind }
	}
}