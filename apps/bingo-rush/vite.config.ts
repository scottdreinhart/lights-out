import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/ui': path.resolve(__dirname, './src/ui'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'es2020',
    modulePreload: { polyfill: false },
    minify: 'esbuild',
    cssMinify: true,
  },
})
