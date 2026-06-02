import { defineConfig } from 'vite'
import {
  createOptimizedBuild,
  createOptimizedPlugins,
} from '../../scripts/vite/createOptimizedViteConfig.mjs'

export default defineConfig({
  plugins: createOptimizedPlugins(),

  build: createOptimizedBuild(),
})
