import { COLOR_THEMES } from '@/domain'

export interface ThemeRegistryEntry {
  id: string
  label: string
  accent: string
}

export const themeRegistry: ThemeRegistryEntry[] = COLOR_THEMES.map((theme) => ({
  id: theme.id,
  label: theme.label,
  accent: theme.accent,
}))
