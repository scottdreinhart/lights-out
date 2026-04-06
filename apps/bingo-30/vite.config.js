import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/domain': path.resolve(__dirname, 'src/domain'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
    },
  },
  build: {
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
    },
  },
})
