/**
 * Crossclimb Domain Constants
 * Game configuration and constants
 */

import type { DifficultyConfig } from './types'

export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  easy: {
    nodeCount: 8,
    edgeDensity: 0.4,
    checkpointCount: 2,
    maxWeight: 3,
  },
  medium: {
    nodeCount: 12,
    edgeDensity: 0.35,
    checkpointCount: 3,
    maxWeight: 4,
  },
  hard: {
    nodeCount: 16,
    edgeDensity: 0.3,
    checkpointCount: 4,
    maxWeight: 5,
  },
  expert: {
    nodeCount: 20,
    edgeDensity: 0.25,
    checkpointCount: 5,
    maxWeight: 6,
  },
}

export const NODE_COLORS = {
  start: '#27ae60',      // Green
  end: '#e74c3c',        // Red
  checkpoint: '#f39c12', // Orange
  normal: '#3498db',     // Blue
  visited: '#9b59b6',    // Purple
  current: '#e67e22',    // Dark orange
} as const

export const EDGE_COLORS = {
  traversable: '#95a5a6',   // Gray
  traversed: '#2c3e50',     // Dark blue
  blocked: '#e74c3c',       // Red
} as const

export const NODE_RADIUS = 20
export const EDGE_WIDTH = 3
export const CANVAS_PADDING = 40

export const ANIMATION_DURATION = 300 // ms
export const PATH_HIGHLIGHT_DURATION = 2000 // ms

export const MAX_SEARCH_DEPTH = 1000
export const SEARCH_TIMEOUT = 5000 // ms