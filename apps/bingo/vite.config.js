import { resolve } from 'path'
import { defineConfig } from 'vite'
import {
  createOptimizedBuild,
  createOptimizedPlugins,
  createOptimizedResolve,
} from '../../scripts/vite/createOptimizedViteConfig.mjs'

const __dirname = import.meta.dirname

export default defineConfig({
  base: './',
  plugins: createOptimizedPlugins(),
  resolve: {
    ...createOptimizedResolve(),
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/domain': resolve(__dirname, 'src/domain'),
      '@/app': resolve(__dirname, 'src/app'),
      '@/ui': resolve(__dirname, 'src/ui'),
      '@games/bingo-ui-components': resolve(__dirname, '../../packages/bingo-ui-components/src'),
      '@games/bingo-core': resolve(__dirname, '../../packages/bingo-core/src'),
      '@games/bingo-domain': resolve(__dirname, '../../packages/bingo-domain/src'),
      '@games/bingo-game-hooks': resolve(__dirname, '../../packages/bingo-game-hooks/src'),
      '@games/bingo-theme-tokens': resolve(__dirname, '../../packages/bingo-theme-tokens/src'),
      '@games/app-hook-utils': resolve(__dirname, '../../packages/app-hook-utils/src'),
      '@games/ui-board-core': resolve(__dirname, '../../packages/ui-board-core/src'),
      '@games/shared-hooks': resolve(__dirname, '../../packages/shared-hooks/src'),
      '@games/theme-context': resolve(__dirname, '../../packages/theme-context/src'),
      '@games/sound-context': resolve(__dirname, '../../packages/sound-context/src'),
      '@games/theme-contract': resolve(__dirname, '../../packages/theme-contract/src'),
    },
  },
  build: createOptimizedBuild(),
})
