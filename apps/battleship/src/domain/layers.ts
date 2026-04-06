/**
 * Layer (z-index) configuration for Battleship
 * Centralizes z-index values and CSS variable generation
 */

export interface LayerConfig {
  name: string
  zIndex: number
}

export interface LayerStack {
  [key: string]: number
}

/**
 * Get z-index stack configuration for the game theme
 * Returns layering configuration appropriate for the color theme
 */
export const getLayerStack = (_colorTheme: string): LayerStack => {
  // Standard layer configuration for Battleship
  // Can be customized per theme if needed
  return {
    '--z-base': 1,
    '--z-board': 10,
    '--z-cells': 20,
    '--z-overlay': 100,
    '--z-menu': 200,
    '--z-modal': 300,
  }
}

/**
 * Convert layer stack to CSS variables object
 * Returns object suitable for applying to element.style.setProperty()
 */
export const layerStackToCssVars = (stack: LayerStack): Record<string, string> => {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(stack)) {
    vars[key] = String(value)
  }
  return vars
}

/**
 * Get game-specific CSS variables for Battleship UI
 * Includes grid sizing, colors, and cell states
 */
export const getGameboardCssVars = (): Record<string, string> => {
  return {
    '--grid-size': '10',
    '--grid-bg': 'rgba(255, 255, 255, 0.03)',
    '--grid-border': 'rgba(255, 255, 255, 0.1)',
    '--accent': '#667eea',
    '--cell-empty': 'rgba(255, 255, 255, 0.05)',
    '--cell-ship': 'rgba(102, 126, 234, 0.5)',
    '--cell-hit': 'rgba(239, 68, 68, 0.6)',
    '--cell-miss': 'rgba(100, 200, 255, 0.4)',
  }
}

export const LAYER_Z = {
  base: 1,
  board: 10,
  cells: 20,
  overlay: 100,
  menu: 200,
  modal: 300,
} as const
