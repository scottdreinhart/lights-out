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
  resolve: {
    ...createOptimizedResolve(),
    alias: {
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/domain': path.resolve(__dirname, 'src/domain'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
    },
  },
  build: createOptimizedBuild(),
})
