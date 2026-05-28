// Sources: https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md
// and https://patents.google.com/patent/US5966526A/en
// The scaffold mirrors the repository's existing Vite app shape while keeping
// the Tamagotchi simulation logic isolated in domain modules.

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import {
  createOptimizedBuild,
  createOptimizedPlugins,
  createOptimizedResolve,
} from '../../scripts/vite/createOptimizedViteConfig.mjs'

export default defineConfig({
  plugins: createOptimizedPlugins(),
  resolve: {
    ...createOptimizedResolve(),
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@games/common': fileURLToPath(
        new URL('../../packages/common/src/index.ts', import.meta.url),
      ),
    },
  },
  build: createOptimizedBuild(),
  server: {
    port: 5173,
    host: true,
  },
})
