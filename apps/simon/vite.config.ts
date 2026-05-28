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
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/ui': path.resolve(__dirname, './src/ui'),
    },
  },
})
