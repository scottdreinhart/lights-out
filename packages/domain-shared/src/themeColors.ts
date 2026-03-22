export type ThemeCssVariables = Record<string, string>
export type SharedThemeColors = Record<string, ThemeCssVariables>

const BASE_THEME_COLORS: ThemeCssVariables = {
  '--theme-primary': '#667eea',
  '--theme-secondary': '#764ba2',
  '--theme-accent': '#667eea',
  '--theme-bg': '#1a1a2e',
  '--theme-fg': '#e0e0e0',
  '--theme-card': '#2d2d44',
  '--theme-border': '#3d3d5c',
}

const NEON_THEME_COLORS: ThemeCssVariables = {
  '--theme-primary': '#00ff41',
  '--theme-secondary': '#00cc33',
  '--theme-accent': '#00ff41',
  '--theme-bg': '#0a0e27',
  '--theme-fg': '#e0e0e0',
  '--theme-card': '#1a1f3a',
  '--theme-border': '#00ff41',
}

const OCEAN_THEME_COLORS: ThemeCssVariables = {
  '--theme-primary': '#0ea5e9',
  '--theme-secondary': '#06b6d4',
  '--theme-accent': '#0ea5e9',
  '--theme-bg': '#0f172a',
  '--theme-fg': '#e0e7ff',
  '--theme-card': '#1e293b',
  '--theme-border': '#0ea5e9',
}

const SUNSET_THEME_COLORS: ThemeCssVariables = {
  '--theme-primary': '#f97316',
  '--theme-secondary': '#ea580c',
  '--theme-accent': '#f97316',
  '--theme-bg': '#1f1b1a',
  '--theme-fg': '#fde68a',
  '--theme-card': '#3d2c27',
  '--theme-border': '#f97316',
}

const FOREST_THEME_COLORS: ThemeCssVariables = {
  '--theme-primary': '#22c55e',
  '--theme-secondary': '#16a34a',
  '--theme-accent': '#22c55e',
  '--theme-bg': '#0f2818',
  '--theme-fg': '#dcfce7',
  '--theme-card': '#1b4332',
  '--theme-border': '#22c55e',
}

const ROSE_THEME_COLORS: ThemeCssVariables = {
  '--theme-primary': '#f43f5e',
  '--theme-secondary': '#e11d48',
  '--theme-accent': '#f43f5e',
  '--theme-bg': '#1f0f1a',
  '--theme-fg': '#ffe4e6',
  '--theme-card': '#3d1a28',
  '--theme-border': '#f43f5e',
}

const MIDNIGHT_THEME_COLORS: ThemeCssVariables = {
  '--theme-primary': '#a78bfa',
  '--theme-secondary': '#9333ea',
  '--theme-accent': '#a78bfa',
  '--theme-bg': '#1e1b4b',
  '--theme-fg': '#e9d5ff',
  '--theme-card': '#312e81',
  '--theme-border': '#a78bfa',
}

const HIGH_CONTRAST_THEME_COLORS: ThemeCssVariables = {
  '--theme-primary': '#ffcc00',
  '--theme-secondary': '#ffaa00',
  '--theme-accent': '#ffcc00',
  '--theme-bg': '#000000',
  '--theme-fg': '#ffffff',
  '--theme-card': '#333333',
  '--theme-border': '#ffcc00',
}

export const SHARED_THEME_COLORS: SharedThemeColors = {
  classic: BASE_THEME_COLORS,
  'chiba-city': NEON_THEME_COLORS,
  'neon-core': BASE_THEME_COLORS,
  'neon-arcade': OCEAN_THEME_COLORS,
  'night-district': SUNSET_THEME_COLORS,
  gridline: FOREST_THEME_COLORS,
  vaporwave: ROSE_THEME_COLORS,
  synthwave: MIDNIGHT_THEME_COLORS,
  'high-contrast': HIGH_CONTRAST_THEME_COLORS,
}