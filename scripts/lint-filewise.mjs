import { readdirSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const args = process.argv.slice(2)
const scopeArg = args.find((arg) => arg.startsWith('--scope='))
const scope = scopeArg ? scopeArg.split('=')[1] : 'src/app'
const perFileTimeoutMs = Number.parseInt(process.env.LINT_FILE_TIMEOUT_MS ?? '15000', 10)

const exts = new Set(['.ts', '.tsx'])

const walk = (dir) => {
  const entries = readdirSync(dir)
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const st = statSync(fullPath)
    if (st.isDirectory()) {
      files.push(...walk(fullPath))
      continue
    }
    if (exts.has(path.extname(fullPath))) {
      files.push(fullPath)
    }
  }

  return files
}

const files = walk(scope)
console.log(`Filewise lint scope: ${scope}`)
console.log(`Files: ${files.length}`)
console.log(`Per-file timeout: ${perFileTimeoutMs}ms`)

const eslintBin =
  process.platform === 'win32' ? '.\\node_modules\\.bin\\eslint.cmd' : './node_modules/.bin/eslint'

let totalErrors = 0
let timedOut = 0
let failedFiles = 0

for (const file of files) {
  console.log(`[SCAN] ${file}`)
  const result = spawnSync(eslintBin, [file, '--format', 'json'], {
    encoding: 'utf8',
    shell: false,
    timeout: perFileTimeoutMs,
  })

  if (result.error && String(result.error.message).toLowerCase().includes('timed out')) {
    timedOut += 1
    failedFiles += 1
    console.log(`[TIMEOUT] ${file}`)
    continue
  }

  let report = []
  if (result.stdout?.trim()) {
    try {
      report = JSON.parse(result.stdout)
    } catch {
      if ((result.status ?? 0) !== 0) {
        failedFiles += 1
        console.log(`[FAIL] ${file} (unparseable eslint output)`)
      }
      continue
    }
  }

  const fileErrors = report.reduce((sum, item) => sum + (item.errorCount ?? 0), 0)
  const fileWarnings = report.reduce((sum, item) => sum + (item.warningCount ?? 0), 0)

  if (fileErrors > 0 || fileWarnings > 0) {
    failedFiles += 1
    totalErrors += fileErrors
    console.log(`[ISSUES] ${file} errors=${fileErrors} warnings=${fileWarnings}`)
  }
}

console.log('\n--- FILEWISE LINT SUMMARY ---')
console.log(`failedFiles=${failedFiles}`)
console.log(`errors=${totalErrors}`)
console.log(`timeouts=${timedOut}`)

if (failedFiles > 0 || timedOut > 0) {
  process.exit(1)
}
