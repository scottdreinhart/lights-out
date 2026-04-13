import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    include: [
      '**/*.unit.test.ts',
      '**/*.unit.test.tsx',
      '**/*.integration.test.ts',
      '**/*.integration.test.tsx',
      '**/*.component.test.ts',
      '**/*.component.test.tsx',
      '**/*.api.test.ts',
      '**/*.api.test.tsx',
    ],
    exclude: [
      'node_modules',
      'dist',
      'release',
      '.next',
      '.idea',
      '.git',
      '.cache',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
