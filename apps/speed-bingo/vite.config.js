import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const __dirname = import.meta.dirname

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/domain': resolve(__dirname, 'src/domain'),
      '@/app': resolve(__dirname, 'src/app'),
      '@/ui': resolve(__dirname, 'src/ui'),
      '@games/domain-shared': resolve(__dirname, '../../packages/domain-shared/src'),
      '@games/common': resolve(__dirname, '../../packages/common/src'),
      '@games/storage-utils': resolve(__dirname, '../../packages/storage-utils/src'),
      '@games/sound-context': resolve(__dirname, '../../packages/sound-context/src'),
      '@games/theme-context': resolve(__dirname, '../../packages/theme-context/src'),
      '@games/app-hook-utils': resolve(__dirname, '../../packages/app-hook-utils/src'),
      '@games/assets-shared': resolve(__dirname, '../../packages/assets-shared/src'),
      '@games/ui-board-core': resolve(__dirname, '../../packages/ui-board-core/src'),
      '@games/ui-utils': resolve(__dirname, '../../packages/ui-utils/src'),
      '@games/theme-contract': resolve(__dirname, '../../packages/theme-contract/src'),
      '@games/ai-framework': resolve(__dirname, '../../packages/ai-framework/src'),
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'es2020',
    modulePreload: { polyfill: false },
    minify: 'esbuild',
    cssMinify: true,
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
