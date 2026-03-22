/**
 * Layer (z-index) configuration for TicTacToe
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
  // Standard layer configuration for TicTacToe
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

export const LAYER_Z = {
  base: 1,
  board: 10,
  cells: 20,
  overlay: 100,
  menu: 200,
  modal: 300,
} as const
