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
      '@games/ai-framework': path.resolve(__dirname, '../../packages/ai-framework/src'),
      '@games/bingo-ui-components': path.resolve(
        __dirname,
        '../../packages/bingo-ui-components/src',
      ),
      '@games/ui-board-core': path.resolve(__dirname, '../../packages/ui-board-core/src'),
      '@games/app-hook-utils': path.resolve(__dirname, '../../packages/app-hook-utils/src'),
      '@games/assets-shared': path.resolve(__dirname, '../../packages/assets-shared/src'),
      '@games/card-deck-core': path.resolve(__dirname, '../../packages/card-deck-core/src'),
      '@games/card-deck-system': path.resolve(__dirname, '../../packages/card-deck-system/src'),
      '@games/common': path.resolve(__dirname, '../../packages/common/src'),
      '@games/crash-logger': path.resolve(__dirname, '../../packages/crash-logger/src'),
      '@games/crash-utils': path.resolve(__dirname, '../../packages/crash-utils/src'),
      '@games/display-contract': path.resolve(__dirname, '../../packages/display-contract/src'),
      '@games/domain-shared': path.resolve(__dirname, '../../packages/domain-shared/src'),
      '@games/haptics': path.resolve(__dirname, '../../packages/haptics/src'),
      '@games/shared-hooks': path.resolve(__dirname, '../../packages/shared-hooks/src'),
      '@games/sound-context': path.resolve(__dirname, '../../packages/sound-context/src'),
      '@games/sprite-contract': path.resolve(__dirname, '../../packages/sprite-contract/src'),
      '@games/stats-utils': path.resolve(__dirname, '../../packages/stats-utils/src'),
      '@games/storage-utils': path.resolve(__dirname, '../../packages/storage-utils/src'),
      '@games/theme-context': path.resolve(__dirname, '../../packages/theme-context/src'),
      '@games/theme-contract': path.resolve(__dirname, '../../packages/theme-contract/src'),
      '@games/ui-utils': path.resolve(__dirname, '../../packages/ui-utils/src'),
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
