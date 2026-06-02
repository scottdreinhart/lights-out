import { spawnSync } from 'node:child_process'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  WHITE: '\x1b[97m',
  BLUE: '\x1b[94m',
  MAGENTA: '\x1b[95m',
  GRAY: '\x1b[90m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

/**
 * Standardized boxed header for terminal output
 */
function boxedHeader(title, color = COLORS.BLUE) {
  const width = 80
  const horizontalLine = '═'.repeat(width - 2)
  
  console.log(`\n${COLORS.WHITE}╔${horizontalLine}╗${COLORS.RESET}`)
  
  const paddingTotal = width - 2 - title.length
  const paddingLeft = Math.floor(paddingTotal / 2)
  const paddingRight = paddingTotal - paddingLeft
  
  console.log(`${COLORS.WHITE}║${' '.repeat(paddingLeft)}${COLORS.BOLD}${color}${title}${COLORS.RESET}${COLORS.WHITE}${' '.repeat(paddingRight)}║${COLORS.RESET}`)
  console.log(`${COLORS.WHITE}╚${horizontalLine}╝${COLORS.RESET}\n`)
}

const args = process.argv.slice(2)
const mode = args.includes('--full') ? 'full' : 'fast'

boxedHeader(`QUALITY GATE: ${mode.toUpperCase()}`, mode === 'full' ? COLORS.MAGENTA : COLORS.CYAN)

const defaultTimeoutMs = Number.parseInt(
  process.env.QUALITY_GATE_TIMEOUT_MS ?? (mode === 'full' ? '180000' : '90000'),
  10,
)

const eslintBin =
  process.platform === 'win32' ? '.\\node_modules\\.bin\\eslint.cmd' : './node_modules/.bin/eslint'
const tscBin = process.platform === 'win32' ? '.\\node_modules\\.bin\\tsc.cmd' : './node_modules/.bin/tsc'
const prettierBin =
  process.platform === 'win32' ? '.\\node_modules\\.bin\\prettier.cmd' : './node_modules/.bin/prettier'
const viteBin = process.platform === 'win32' ? '.\\node_modules\\.bin\\vite.cmd' : './node_modules/.bin/vite'

const stepsByMode = {
  fast: [
    { name: 'lint:scope:app', command: `${eslintBin} src/app` },
    { name: 'lint:scope:ui', command: `${eslintBin} src/ui` },
    { name: 'typecheck', command: `${tscBin}` },
  ],
  full: [
    {
      name: 'lint:scope:all',
      command:
        `${eslintBin} src/app && ${eslintBin} src/domain && ${eslintBin} src/ui && ${eslintBin} src/infrastructure && ${eslintBin} src/wasm && ${eslintBin} src/workers`,
    },
    { name: 'lint:type:all', command: 'pnpm lint:type:all' },
    { name: 'format:check', command: `${prettierBin} --check src/` },
    { name: 'typecheck', command: `${tscBin}` },
    { name: 'build', command: `${viteBin} build` },
  ],
}

const steps = stepsByMode[mode]

if (!steps) {
  console.error(`${COLORS.RED}${COLORS.BOLD}❌ Unknown mode '${mode}'${COLORS.RESET}`)
  process.exit(2)
}

console.log(`${COLORS.GRAY}  Step timeout: ${defaultTimeoutMs}ms${COLORS.RESET}\n`)

for (const step of steps) {
  console.log(`\n${COLORS.MAGENTA}[${steps.indexOf(step) + 1}/${steps.length}] 🧪 ${step.name}${COLORS.RESET}`)

  const startedAt = Date.now()
  const timeoutSeconds = Math.max(1, Math.ceil(defaultTimeoutMs / 1000))
  const wrappedCommand = `timeout ${timeoutSeconds}s ${step.command}`

  const result = spawnSync(wrappedCommand, {
    stdio: 'inherit',
    shell: true,
  })

  const elapsedMs = Date.now() - startedAt

  if (result.status === 124) {
    console.error(`${COLORS.RED}${COLORS.BOLD}⏳ TIMEOUT${COLORS.RESET}: ${step.name} after ${elapsedMs}ms`)
    process.exit(124)
  }

  if (result.status !== 0) {
    console.error(`${COLORS.RED}${COLORS.BOLD}❌ FAILED${COLORS.RESET}: ${step.name} (exit ${result.status ?? 1}) ${elapsedMs}ms`)
    process.exit(result.status ?? 1)
  }

  console.log(`${COLORS.GREEN}✅ PASSED${COLORS.RESET}: ${step.name} (${elapsedMs}ms)`)
}

console.log(`\n${COLORS.GREEN}${COLORS.BOLD}✅ Quality gate complete${COLORS.RESET}`)
