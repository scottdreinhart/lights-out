import { resolve } from 'path'
import { defineConfig } from 'vite'
import {
  createOptimizedBuild,
  createOptimizedPlugins,
  createOptimizedResolve,
} from '../../scripts/vite/createOptimizedViteConfig.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: createOptimizedPlugins(),
  resolve: {
    ...createOptimizedResolve(),
    alias: {
      '@': resolve(__dirname, 'src'),
      '@games/bingo-core': resolve(__dirname, '../../packages/bingo-core/dist/index.js'),
      '@games/ui-board-core': resolve(__dirname, '../../packages/ui-board-core/src/index.ts'),
    },
  },
  build: createOptimizedBuild(),
  server: {
    port: 5173,
    host: true,
  },
})
