import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/domain': path.resolve(__dirname, 'src/domain'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
      '@/themes': path.resolve(__dirname, 'src/themes'),
      '@/workers': path.resolve(__dirname, 'src/workers'),
      '@/wasm': path.resolve(__dirname, 'src/wasm'),
      '@games/sound-context': path.resolve(__dirname, '../../packages/sound-context/src'),
      '@games/theme-context': path.resolve(__dirname, '../../packages/theme-context/src'),
      '@games/crash-logger': path.resolve(__dirname, '../../packages/crash-logger/src'),
      '@games/haptics': path.resolve(__dirname, '../../packages/haptics/src'),
      '@games/storage-utils': path.resolve(__dirname, '../../packages/storage-utils/src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
})
