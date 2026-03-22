import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isAnalyzeMode = mode === 'analyze'

  return {
    base: './',
    plugins: [
      react(),
      isAnalyzeMode &&
        visualizer({
          filename: 'dist/bundle-report.html',
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'es2020',
      cssTarget: 'es2020',
      chunkSizeWarningLimit: 1100,
      modulePreload: { polyfill: false },
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        external: [
          '@capacitor/core',
          '@capacitor/haptics',
          '@capacitor/preferences',
          '@capacitor/app',
        ],
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return
            }

            // Capacitor (mobile bridge) - separate for iOS/Android
            if (id.includes('/@capacitor/')) {
              return 'vendor-capacitor'
            }

            // Ionic runtime split to avoid overloading React chunk
            if (id.includes('/@ionic/react/')) {
              return 'vendor-ionic-react'
            }

            if (id.includes('/@ionic/core/')) {
              return 'vendor-ionic-core'
            }

            if (id.includes('/@stencil/core/')) {
              return 'vendor-ionic-stencil'
            }

            if (id.includes('/ionicons/')) {
              return 'vendor-ionic-icons'
            }

            // React vendor chunk (core only)
            if (
              /\/node_modules\/(react|react-dom|scheduler)\//.test(id) ||
              /\\node_modules\\(react|react-dom|scheduler)\\/.test(id)
            ) {
              return 'vendor-react'
            }

            // Electron packages should NOT be bundled in web build
            // They are only used in electron/main.js and electron/preload.js
            if (
              id.includes('/electron/') ||
              id.includes('/electron-store/') ||
              id.includes('/electron-log/') ||
              id.includes('/electron-updater/')
            ) {
              return null // Externalize: don't bundle these in web output
            }

            // REMOVED: catch-all 'vendor' chunk causing circular dependency issues
            // App utilities will now be bundled together with app code (AppWithProviders)
            // This fixes circular dependency warnings from context re-exports
            return undefined
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
  }
})
