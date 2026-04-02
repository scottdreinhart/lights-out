import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-report.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/domain': path.resolve(__dirname, 'src/domain'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
      '@games/ai-framework': path.resolve(__dirname, '../../packages/ai-framework/src'),
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
  build: {
    target: 'es2020',
    cssTarget: 'es2020',
    modulePreload: { polyfill: false },
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
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
