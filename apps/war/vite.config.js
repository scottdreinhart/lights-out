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
      '@games/assets-shared': resolve(__dirname, '../../packages/assets-shared/src/index.ts'),
      '@games/common': resolve(__dirname, '../../packages/common/src/index.ts'),
      '@games/card-deck-core': resolve(__dirname, '../../packages/card-deck-core/src'),
    },
  },

  build: createOptimizedBuild(),
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
