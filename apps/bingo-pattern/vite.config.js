import path from 'path'
import { defineConfig } from 'vite'
import {
  createOptimizedBuild,
  createOptimizedPlugins,
  createOptimizedResolve,
} from '../../scripts/vite/createOptimizedViteConfig.mjs'

export default defineConfig({
  plugins: createOptimizedPlugins(),
  server: {
    port: 5173,
    open: true,
  },

  build: createOptimizedBuild(),
  resolve: {
    ...createOptimizedResolve(),
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
