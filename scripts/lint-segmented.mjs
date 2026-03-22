import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)

const getArgValue = (name, fallback) => {
  const match = args.find((arg) => arg.startsWith(`${name}=`))
  if (!match) {
    return fallback
  }
  return match.slice(name.length + 1)
}

const segment = getArgValue('--segment', 'all')
const scope = getArgValue('--scope', 'all')
const applyFix = args.includes('--fix')

const scopeTargets = {
  all: 'src',
  app: 'src/app',
  domain: 'src/domain',
  ui: 'src/ui',
  infrastructure: 'src/infrastructure',
  wasm: 'src/wasm',
  workers: 'src/workers',
}

const target = scopeTargets[scope]

if (!target) {
  console.error(`Unknown scope '${scope}'. Valid scopes: ${Object.keys(scopeTargets).join(', ')}`)
  process.exit(2)
}

const segmentMatchers = {
  all: () => true,
  a11y: (ruleId) => ruleId?.startsWith('jsx-a11y/'),
  security: (ruleId) => ruleId?.startsWith('security/'),
  hooks: (ruleId) => ruleId?.startsWith('react-hooks/'),
  react: (ruleId) => ruleId?.startsWith('react/'),
  boundaries: (ruleId) => ruleId?.startsWith('boundaries/'),
  typescript: (ruleId) => ruleId?.startsWith('@typescript-eslint/'),
  core: (ruleId) =>
    Boolean(ruleId) &&
    !ruleId.startsWith('jsx-a11y/') &&
    !ruleId.startsWith('security/') &&
    !ruleId.startsWith('react-hooks/') &&
    !ruleId.startsWith('react/') &&
    !ruleId.startsWith('boundaries/') &&
    !ruleId.startsWith('@typescript-eslint/'),
}

const matchesSegment = segmentMatchers[segment]

if (!matchesSegment) {
  console.error(`Unknown segment '${segment}'. Valid segments: ${Object.keys(segmentMatchers).join(', ')}`)
  process.exit(2)
}

const commandArgs = ['exec', 'eslint', target, '--format', 'json']
if (applyFix) {
  commandArgs.push('--fix')
}

const result = spawnSync('pnpm', commandArgs, {
  encoding: 'utf8',
  shell: process.platform === 'win32',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(2)
}

const raw = result.stdout?.trim() ?? ''
if (!raw) {
  if (result.stderr) {
    process.stderr.write(result.stderr)
  }
  process.exit(result.status ?? 0)
}

let reports
try {
  reports = JSON.parse(raw)
} catch {
  if (result.stdout) {
    process.stdout.write(result.stdout)
  }
  if (result.stderr) {
    process.stderr.write(result.stderr)
  }
  process.exit(result.status ?? 1)
}

const issues = []

for (const report of reports) {
  const filePath = String(report.filePath ?? '').replaceAll('\\\\', '/')
  for (const message of report.messages ?? []) {
    if (!matchesSegment(message.ruleId ?? '')) {
      continue
    }

    issues.push({
      filePath,
      line: message.line ?? 0,
      column: message.column ?? 0,
      severity: message.severity === 2 ? 'error' : 'warn',
      ruleId: message.ruleId ?? 'unknown-rule',
      text: message.message ?? '',
    })
  }
}

const errorCount = issues.filter((issue) => issue.severity === 'error').length
const warningCount = issues.filter((issue) => issue.severity === 'warn').length

console.log(`Segment: ${segment}`)
console.log(`Scope: ${scope}`)
console.log(`Issues: ${issues.length} (errors: ${errorCount}, warnings: ${warningCount})`)

for (const issue of issues) {
  console.log(
    `${issue.filePath}:${issue.line}:${issue.column}  ${issue.severity}  ${issue.ruleId}  ${issue.text}`,
  )
}

if (result.stderr) {
  process.stderr.write(result.stderr)
}

process.exit(errorCount > 0 ? 1 : 0)
