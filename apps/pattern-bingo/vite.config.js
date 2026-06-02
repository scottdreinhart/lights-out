import path from 'path'
import { defineConfig } from 'vite'
import {
  createOptimizedBuild,
  createOptimizedPlugins,
  createOptimizedResolve,
} from '../../scripts/vite/createOptimizedViteConfig.mjs'

export default defineConfig({
  plugins: createOptimizedPlugins(),
  resolve: {
    ...createOptimizedResolve(),
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/domain': path.resolve(__dirname, 'src/domain'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
      '@games/bingo-game-hooks': path.resolve(__dirname, '../../packages/bingo-game-hooks/src'),
      '@games/bingo-domain': path.resolve(__dirname, '../../packages/bingo-domain/src'),
      '@games/bingo-core': path.resolve(__dirname, '../../packages/bingo-core/src'),
      '@games/bingo-ui-components': path.resolve(
        __dirname,
        '../../packages/bingo-ui-components/src',
      ),
      '@games/app-hook-utils': path.resolve(__dirname, '../../packages/app-hook-utils/src'),
      '@games/ui-board-core': path.resolve(__dirname, '../../packages/ui-board-core/src'),
      '@games/theme-context': path.resolve(__dirname, '../../packages/theme-context/src'),
      '@games/common': path.resolve(__dirname, '../../packages/common/src'),
    },
  },

  build: createOptimizedBuild(),
})
