import path from 'path'
import { defineConfig } from 'vite'
import {
  createOptimizedBuild,
  createOptimizedPlugins,
  createOptimizedResolve,
} from '../../scripts/vite/createOptimizedViteConfig.mjs'

export default defineConfig(({ mode }) => {
  const isAnalyzeMode = mode === 'analyze'

  return {
    base: './',
    plugins: createOptimizedPlugins({ mode, visualizerMode: 'analyze' }),
    resolve: {
      ...createOptimizedResolve(),
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    build: createOptimizedBuild(),
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      hmr: {
        host: 'localhost',
        port: 5173,
      },
    },
  }
})
