import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const mode = args.includes('--full') ? 'full' : 'fast'

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
  console.error(`Unknown mode '${mode}'`)
  process.exit(2)
}

console.log(`Quality mode: ${mode}`)
console.log(`Step timeout: ${defaultTimeoutMs}ms`)

for (const step of steps) {
  console.log(`\n--- STEP START: ${step.name} ---`)

  const startedAt = Date.now()
  const timeoutSeconds = Math.max(1, Math.ceil(defaultTimeoutMs / 1000))
  const wrappedCommand = `timeout ${timeoutSeconds}s ${step.command}`

  const result = spawnSync(wrappedCommand, {
    stdio: 'inherit',
    shell: true,
  })

  const elapsedMs = Date.now() - startedAt

  if (result.status === 124) {
    console.error(`--- STEP TIMEOUT: ${step.name} after ${elapsedMs}ms ---`)
    process.exit(124)
  }

  if (result.status !== 0) {
    console.error(`--- STEP FAIL: ${step.name} (exit ${result.status ?? 1}) after ${elapsedMs}ms ---`)
    process.exit(result.status ?? 1)
  }

  console.log(`--- STEP PASS: ${step.name} (${elapsedMs}ms) ---`)
}

console.log('\nQUALITY GATE PASS')
