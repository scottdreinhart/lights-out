import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/setup-tests.ts'],
    include: [
      'src/**/*.unit.test.ts',
      'src/**/*.unit.test.tsx',
      'src/**/*.integration.test.ts',
      'src/**/*.integration.test.tsx',
    ],
    exclude: ['node_modules', 'dist', 'src/**/*.component.test.ts', 'src/**/*.component.test.tsx'],
  },
})
