import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
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
  },sourcemap: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
