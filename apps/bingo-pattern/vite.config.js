import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    
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
