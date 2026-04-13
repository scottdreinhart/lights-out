import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    entry: 'src/main/index.ts',
    vite: {
      build: {
        outDir: 'dist/main',
        ssr: true
      }
    }
  },
  preload: {
    entry: 'src/preload/index.ts',
    vite: {
      build: {
        outDir: 'dist/preload',
        lib: {
          entry: 'src/preload/index.ts',
          name: 'preload',
          formats: ['cjs']
        }
      }
    }
  },
  renderer: {
    entry: 'src/renderer/index.tsx',
    vite: {
      build: {
        outDir: 'dist/renderer'
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src/renderer')
        }
      }
    }
  }
})
