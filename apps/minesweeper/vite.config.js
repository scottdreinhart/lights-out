import path from 'path'
import { defineConfig } from 'vite'
import {
  createOptimizedBuild,
  createOptimizedPlugins,
  createOptimizedResolve,
} from '../../scripts/vite/createOptimizedViteConfig.mjs'

export default defineConfig({
  base: './',
  plugins: createOptimizedPlugins(),
  resolve: {
    ...createOptimizedResolve(),
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/domain': path.resolve(__dirname, 'src/domain'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
      '@games/domain-shared': path.resolve(__dirname, '../../packages/domain-shared/src'),
      '@games/common': path.resolve(__dirname, '../../packages/common/src'),
      '@games/storage-utils': path.resolve(__dirname, '../../packages/storage-utils/src'),
      '@games/sound-context': path.resolve(__dirname, '../../packages/sound-context/src'),
      '@games/theme-context': path.resolve(__dirname, '../../packages/theme-context/src'),
      '@games/app-hook-utils': path.resolve(__dirname, '../../packages/app-hook-utils/src'),
      '@games/assets-shared': path.resolve(__dirname, '../../packages/assets-shared/src'),
      '@games/ui-board-core': path.resolve(__dirname, '../../packages/ui-board-core/src'),
      '@games/ui-utils': path.resolve(__dirname, '../../packages/ui-utils/src'),
      '@games/theme-contract': path.resolve(__dirname, '../../packages/theme-contract/src'),
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
})
