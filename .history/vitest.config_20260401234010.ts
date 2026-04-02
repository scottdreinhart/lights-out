import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vitest Configuration — Root Level
 *
 * Configures Vitest for unit, integration, component, and API testing.
 *
 * Test Discovery Patterns:
 *   - *.unit.test.ts(x)
 *   - *.integration.test.ts(x)
 *   - *.component.test.ts(x)
 *   - *.api.test.ts(x)
 *
 * Excludes Playwright specs (*.spec.ts) which are run separately.
 *
 * Run:
 *   pnpm test              # Run all unit tests (default)
 *   pnpm test:unit         # Run unit tests only
 *   pnpm test:integration  # Run integration tests only
 *   pnpm test:component    # Run component tests only
 *   pnpm test:api          # Run API tests only
 *   pnpm test:watch        # Watch mode for TDD
 */

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'release/',
        '.next/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
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
      '**/*.spec.ts', // Playwright specs excluded
      '**/*.spec.tsx', // Playwright specs excluded
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
