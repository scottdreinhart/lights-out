/// <reference types="vitest/config" />
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: path.resolve(__dirname),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/domain': path.resolve(__dirname, 'src/domain'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: [
      'src/**/*.unit.test.ts',
      'src/**/*.unit.test.tsx',
      'src/**/*.integration.test.ts',
      'src/**/*.integration.test.tsx',
      'src/**/*.component.test.ts',
      'src/**/*.component.test.tsx',
      'src/**/*.api.test.ts',
      'src/**/*.api.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/domain/**/*.ts', 'src/app/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/types.ts', '**/constants.ts'],
    },
  },
})
