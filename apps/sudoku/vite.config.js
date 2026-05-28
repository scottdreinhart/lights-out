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
      '@': path.resolve(__dirname, './src'),
      '@games/app-hook-utils': path.resolve(
        __dirname,
        '../../packages/app-hook-utils/src/index.ts',
      ),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: createOptimizedBuild(),
})
