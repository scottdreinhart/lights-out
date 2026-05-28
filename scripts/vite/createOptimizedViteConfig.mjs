import react from '@vitejs/plugin-react'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import zlib from 'node:zlib'
import { visualizer } from 'rollup-plugin-visualizer'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const gzip = promisify(zlib.gzip)
const brotliCompress = promisify(zlib.brotliCompress)

const SHARED_EXTERNAL = [
  '@capacitor/core',
  '@capacitor/app',
  '@capacitor/device',
  '@capacitor/preferences',
  '@capacitor/haptics',
  '@capacitor/splash-screen',
  '@capacitor/keyboard',
]

const PACKAGE_CHUNKS = [
  {
    name: 'react',
    patterns: [/^react$/, /^react-dom$/, /^scheduler$/],
  },
  {
    name: 'pixi-react',
    patterns: [/^@pixi\/react$/],
  },
  {
    name: 'ionic',
    patterns: [/^@ionic\//, /^ionicons$/],
  },
  {
    name: 'capacitor',
    patterns: [/^@capacitor\//],
  },
  {
    name: 'audio',
    patterns: [/^howler$/],
  },
  {
    name: 'state',
    patterns: [/^zustand$/],
  },
]

function getPixiChunk(id) {
  const normalized = id.replace(/\\/g, '/')

  if (!normalized.includes('node_modules/pixi.js/')) {
    return null
  }

  if (normalized.includes('/lib/rendering/') || normalized.includes('/dist/packages/rendering/')) {
    return 'pixi-rendering'
  }

  if (normalized.includes('/lib/scene/') || normalized.includes('/dist/packages/scene/')) {
    return 'pixi-scene'
  }

  if (normalized.includes('/lib/assets/') || normalized.includes('/dist/packages/assets/')) {
    return 'pixi-assets'
  }

  if (
    normalized.includes('/lib/filters/') ||
    normalized.includes('/lib/advanced-blend-modes/') ||
    normalized.includes('/dist/packages/filters/')
  ) {
    return 'pixi-effects'
  }

  return 'pixi-core'
}

function getPackageName(id) {
  const normalized = id.replace(/\\/g, '/')
  const nodeModulesIndex = normalized.lastIndexOf('node_modules/')

  if (nodeModulesIndex === -1) {
    return null
  }

  const packagePath = normalized.slice(nodeModulesIndex + 'node_modules/'.length)
  const parts = packagePath.split('/')

  if (parts[0] === '.pnpm') {
    const pnpmPackage = parts.find(
      (part) => part && part !== '.pnpm' && !part.startsWith('node_modules'),
    )

    if (!pnpmPackage) {
      return null
    }

    const decodedPackage = pnpmPackage.replace(/\+/g, '/')
    const atIndex = decodedPackage.lastIndexOf('@')

    return atIndex > 0 ? decodedPackage.slice(0, atIndex) : decodedPackage
  }

  if (parts[0]?.startsWith('@')) {
    return `${parts[0]}/${parts[1]}`
  }

  return parts[0] ?? null
}

const SHARED_MANUAL_CHUNKS = (id) => {
  const pixiChunk = getPixiChunk(id)

  if (pixiChunk) {
    return pixiChunk
  }

  const packageName = getPackageName(id)

  if (!packageName) {
    return undefined
  }

  for (const chunk of PACKAGE_CHUNKS) {
    if (chunk.patterns.some((pattern) => pattern.test(packageName))) {
      return chunk.name
    }
  }

  if (id.includes('node_modules')) {
    return 'vendor'
  }

  return undefined
}

const COMPRESSIBLE_ASSET_PATTERN = /\.(js|mjs|json|css|html)$/i

async function listFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)))
      continue
    }

    files.push(fullPath)
  }

  return files
}

function compressedArtifactsPlugin({ threshold = 10240 } = {}) {
  let outDir = 'dist'

  return {
    name: 'game-platform:compressed-artifacts',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      outDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const files = await listFiles(outDir)
      const targets = files.filter((filePath) => COMPRESSIBLE_ASSET_PATTERN.test(filePath))
      const compressed = []

      for (const filePath of targets) {
        const source = await fs.readFile(filePath)

        if (source.byteLength < threshold) {
          continue
        }

        const [gzipBuffer, brotliBuffer] = await Promise.all([
          gzip(source, { level: zlib.constants.Z_BEST_COMPRESSION }),
          brotliCompress(source, {
            params: {
              [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
              [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            },
          }),
        ])

        await Promise.all([
          fs.writeFile(`${filePath}.gz`, gzipBuffer),
          fs.writeFile(`${filePath}.br`, brotliBuffer),
        ])

        compressed.push(filePath)
      }

      if (compressed.length > 0) {
        this.info(`Compressed ${compressed.length} build assets with gzip and brotli.`)
      }
    },
  }
}

function mergeRollupOptions(overrides = {}) {
  const outputOverrides = overrides.output ?? {}
  const { output: _ignoredOutput, ...rest } = overrides

  return {
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
    external: SHARED_EXTERNAL,
    ...rest,
    output: {
      manualChunks: SHARED_MANUAL_CHUNKS,
      assetFileNames: 'assets/[name]-[hash][extname]',
      entryFileNames: 'assets/[name]-[hash].js',
      chunkFileNames: 'assets/chunks/[name]-[hash].js',
      ...outputOverrides,
    },
  }
}

export function createOptimizedResolve() {
  return {
    dedupe: ['react', 'react-dom'],
  }
}

export function createOptimizedPlugins({
  mode,
  visualizerMode = 'always',
  extraPlugins = [],
} = {}) {
  const shouldAddVisualizer =
    visualizerMode === 'always' || (visualizerMode === 'analyze' && mode === 'analyze')

  return [
    react(),
    shouldAddVisualizer
      ? visualizer({
          filename: 'dist/bundle-report.html',
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      : null,
    compressedArtifactsPlugin(),
    ...extraPlugins,
  ].filter(Boolean)
}

export function createOptimizedBuild(overrides = {}) {
  const rollupOptions = mergeRollupOptions(overrides.rollupOptions)
  const { rollupOptions: _ignoredRollupOptions, ...rest } = overrides

  return {
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    cssTarget: 'es2020',
    modulePreload: { polyfill: false },
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    ...rest,
    rollupOptions,
  }
}
