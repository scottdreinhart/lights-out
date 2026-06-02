import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/setup-tests.ts'],
    include: [
      'src/**/*.const.unit.test.ts',
      'src/**/*.const.unit.test.tsx',
    ],
    exclude: ['node_modules', 'dist'],
  },
})
