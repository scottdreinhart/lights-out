import { defineConfig } from 'vite'
import { createOptimizedBuild, createOptimizedPlugins, createOptimizedResolve } from '../../../../scripts/vite/createOptimizedViteConfig.mjs'
import path from 'path'

export default defineConfig({
  plugins: createOptimizedPlugins(),
  resolve: {
    ...createOptimizedResolve(),
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: createOptimizedBuild(),
  server: {
    port: 5173,
    open: true
  }
})
