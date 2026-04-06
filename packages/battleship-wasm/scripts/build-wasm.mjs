/**
 * Build script: Compile AssemblyScript to WASM and embed in loader
 *
 * Usage: node scripts/build-wasm.mjs
 *
 * Steps:
 * 1. Compile assembly/index.ts to WASM using AssemblyScript compiler
 * 2. Encode WASM binary as base64
 * 3. Embed base64 string in src/wasm-loader.ts
 * 4. Output dist/ with loader module
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const assemblyDir = path.join(packageRoot, 'assembly')
const srcDir = path.join(packageRoot, 'src')
const buildDir = path.join(packageRoot, 'build')
const distDir = path.join(packageRoot, 'dist')
const loaderPath = path.join(srcDir, 'wasm-loader.ts')

console.log('Building Battleship WASM...')
console.log(`Package root: ${packageRoot}`)

// Step 1: Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true })
}

// Step 2: Compile AssemblyScript to WASM
console.log('\n[1/4] Compiling AssemblyScript...')
try {
  const compileCmd = `npx asc "${assemblyDir}/index.ts" --target release --outFile "${buildDir}/battleship.wasm"`
  console.log(`Command: ${compileCmd}`)
  execSync(compileCmd, { stdio: 'inherit', cwd: packageRoot })
  console.log('✅ AssemblyScript compiled')
} catch (error) {
  console.error('❌ AssemblyScript compilation failed')
  console.error(error.message)
  process.exit(1)
}

// Step 3: Read WASM binary and encode as base64
console.log('\n[2/4] Encoding WASM to base64...')
let wasmBase64 = ''
try {
  const wasmPath = path.join(buildDir, 'battleship.wasm')
  if (!fs.existsSync(wasmPath)) {
    throw new Error(`WASM file not found: ${wasmPath}`)
  }

  const wasmBuffer = fs.readFileSync(wasmPath)
  wasmBase64 = wasmBuffer.toString('base64')
  console.log(`✅ WASM encoded (${wasmBuffer.length} bytes → ${wasmBase64.length} chars)`)
} catch (error) {
  console.error('❌ Base64 encoding failed')
  console.error(error.message)
  process.exit(1)
}

// Step 4: Update wasm-loader.ts with base64 string
console.log('\n[3/4] Embedding WASM in loader...')
try {
  let loaderContent = fs.readFileSync(loaderPath, 'utf-8')

  // Replace placeholder base64 (handles multi-line strings with [\s\S]*?)
  const base64Pattern = /const WASM_BASE64 =\s*'[\s\S]*?'/
  loaderContent = loaderContent.replace(base64Pattern, `const WASM_BASE64 = '${wasmBase64}'`)

  fs.writeFileSync(loaderPath, loaderContent)
  console.log(`✅ Loader updated (${wasmBase64.length} chars embedded)`)
} catch (error) {
  console.error('❌ Loader update failed')
  console.error(error.message)
  process.exit(1)
}

// Step 5: Build TypeScript (tsc)
console.log('\n[4/4] Building TypeScript...')
try {
  execSync('tsc', { stdio: 'inherit', cwd: packageRoot })
  console.log('✅ TypeScript compiled')
} catch (error) {
  console.error('❌ TypeScript compilation failed')
  console.error(error.message)
  process.exit(1)
}

console.log('\n✨ WASM build complete!')
console.log(`Output: ${distDir}`)
console.log(`Artifacts: dist/index.d.ts, dist/index.js, dist/wasm-loader.d.ts, dist/wasm-loader.js`)
