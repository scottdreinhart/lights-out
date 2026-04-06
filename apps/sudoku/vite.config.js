import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@games/app-hook-utils': path.resolve(__dirname, '../../packages/app-hook-utils/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    
  rollupOptions: {
    external: [
      '@capacitor/core',
      '@capacitor/app',
      '@capacitor/device',
      '@capacitor/preferences',
      '@capacitor/haptics',
      '@capacitor/splash-screen',
      '@capacitor/keyboard',
    ],
  },sourcemap: false,
  },
})
