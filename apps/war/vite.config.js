import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

const __dirname = import.meta.dirname

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
      '@': resolve(__dirname, 'src'),
      '@/domain': resolve(__dirname, 'src/domain'),
      '@/app': resolve(__dirname, 'src/app'),
      '@/ui': resolve(__dirname, 'src/ui'),
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'es2020',
    modulePreload: { polyfill: false },
    minify: 'esbuild',
    cssMinify: true,
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
output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react')) {
            return 'react'
          }
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
