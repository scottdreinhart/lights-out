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

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  BLUE: '\x1b[94m',
  MAGENTA: '\x1b[95m',
  WHITE: '\x1b[97m',
  GREEN: '\x1b[92m',
  YELLOW: '\x1b[93m',
  RED: '\x1b[91m',
  GRAY: '\x1b[90m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

console.log(`${COLORS.BLUE}${COLORS.BOLD}🧪 WASM build: Battleship${COLORS.RESET}`)
console.log(`${COLORS.CYAN}  Package root: ${packageRoot}${COLORS.RESET}`)

// Step 1: Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true })
}

// Step 2: Compile AssemblyScript to WASM
console.log(`${COLORS.MAGENTA}\n[1/4] 🧪 Compiling AssemblyScript...${COLORS.RESET}`)
try {
  const compileCmd = `pnpm exec asc "${assemblyDir}/index.ts" --target release --outFile "${buildDir}/battleship.wasm"`
  console.log(`${COLORS.GRAY}  Command: ${compileCmd}${COLORS.RESET}`)
  execSync(compileCmd, { stdio: 'inherit', cwd: packageRoot })
  console.log(`${COLORS.GREEN}  ✅ AssemblyScript compiled${COLORS.RESET}`)
} catch (error) {
  console.error(`${COLORS.RED}${COLORS.BOLD}  ❌ AssemblyScript compilation failed${COLORS.RESET}`)
  console.error(`${COLORS.RED}  ${error.message}${COLORS.RESET}`)
  process.exit(1)
}

// Step 3: Read WASM binary and encode as base64
console.log(`${COLORS.MAGENTA}\n[2/4] 🧪 Encoding WASM to base64...${COLORS.RESET}`)
let wasmBase64 = ''
try {
  const wasmPath = path.join(buildDir, 'battleship.wasm')
  if (!fs.existsSync(wasmPath)) {
    throw new Error(`WASM file not found: ${wasmPath}`)
  }

  const wasmBuffer = fs.readFileSync(wasmPath)
  wasmBase64 = wasmBuffer.toString('base64')
  console.log(`${COLORS.GREEN}  ✅ WASM encoded (${wasmBuffer.length} bytes → ${wasmBase64.length} chars)${COLORS.RESET}`)
} catch (error) {
  console.error(`${COLORS.RED}${COLORS.BOLD}  ❌ Base64 encoding failed${COLORS.RESET}`)
  console.error(`${COLORS.RED}  ${error.message}${COLORS.RESET}`)
  process.exit(1)
}

// Step 4: Update wasm-loader.ts with base64 string
console.log(`${COLORS.MAGENTA}\n[3/4] 🧪 Embedding WASM in loader...${COLORS.RESET}`)
try {
  let loaderContent = fs.readFileSync(loaderPath, 'utf-8')

  // Replace existing base64 payload (handles multi-line strings with [\s\S]*?)
  const base64Pattern = /const WASM_BASE64 =\s*'[\s\S]*?'/
  loaderContent = loaderContent.replace(base64Pattern, `const WASM_BASE64 = '${wasmBase64}'`)

  fs.writeFileSync(loaderPath, loaderContent)
  console.log(`${COLORS.GREEN}  ✅ Loader updated (${wasmBase64.length} chars embedded)${COLORS.RESET}`)
} catch (error) {
  console.error(`${COLORS.RED}${COLORS.BOLD}  ❌ Loader update failed${COLORS.RESET}`)
  console.error(`${COLORS.RED}  ${error.message}${COLORS.RESET}`)
  process.exit(1)
}

// Step 5: Build TypeScript (tsc)
console.log(`${COLORS.MAGENTA}\n[4/4] 🧪 Building TypeScript...${COLORS.RESET}`)
try {
  execSync('tsc', { stdio: 'inherit', cwd: packageRoot })
  console.log(`${COLORS.GREEN}  ✅ TypeScript compiled${COLORS.RESET}`)
} catch (error) {
  console.error(`${COLORS.RED}${COLORS.BOLD}  ❌ TypeScript compilation failed${COLORS.RESET}`)
  console.error(`${COLORS.RED}  ${error.message}${COLORS.RESET}`)
  process.exit(1)
}

console.log(`\n${COLORS.GREEN}${COLORS.BOLD}✅ WASM build complete!${COLORS.RESET}`)
console.log(`${COLORS.CYAN}  Output: ${distDir}${COLORS.RESET}`)
console.log(`${COLORS.CYAN}  Artifacts: dist/index.d.ts, dist/index.js, dist/wasm-loader.d.ts, dist/wasm-loader.js${COLORS.RESET}`)
