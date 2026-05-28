#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const includeBuild = !args.includes('--skip-build')
const timeoutMs = Number.parseInt(
  (args.find((a) => a.startsWith('--timeoutMs=')) || '').split('=')[1] || '600000',
  10,
)
const segmentedScope =
  (args.find((a) => a.startsWith('--testScope=')) || '').split('=')[1] ||
  'apps'
const workspaceScope =
  (args.find((a) => a.startsWith('--workspaceScope=')) || '').split('=')[1] ||
  'apps'
const buildScope =
  (args.find((a) => a.startsWith('--buildScope=')) || '').split('=')[1] ||
  ''
const namesScope =
  (args.find((a) => a.startsWith('--nameScope=')) || '').split('=')[1] ||
  '.'
const namesChunk = Number.parseInt(
  (args.find((a) => a.startsWith('--namesChunk=')) || '').split('=')[1] || '200',
  10,
)
const rootSupersetMode = !args.includes('--no-root-superset')

function formatRemaining(count) {
  return count === 1 ? '1 more' : `${count} more`
}

const isRootDefaultScopes =
  namesScope === '.' &&
  workspaceScope === 'apps' &&
  segmentedScope === 'apps' &&
  buildScope === ''

const steps = []
steps.push({
  name: 'test:names',
  command: 'node',
  commandArgs: ['scripts/validate-test-names-segmented.mjs', `--scope=${namesScope}`, `--chunk=${namesChunk}`],
})

if (rootSupersetMode && isRootDefaultScopes) {
  steps.push({
    name: 'apps:validate:gated',
    command: 'node',
    commandArgs: [
      'scripts/validate-workspace-segmented.mjs',
      '--script=validate:gated',
      '--scope=apps',
      '--forward=--skip-build',
      `--timeoutMs=${timeoutMs}`,
    ],
  })
} else {
  steps.push(
    {
      name: 'lint',
      command: 'node',
      commandArgs: [
        'scripts/validate-workspace-segmented.mjs',
        '--script=lint',
        `--scope=${workspaceScope}`,
        `--timeoutMs=${timeoutMs}`,
      ],
    },
    {
      name: 'format:check',
      command: 'node',
      commandArgs: [
        'scripts/validate-workspace-segmented.mjs',
        '--script=format:check',
        `--scope=${workspaceScope}`,
        `--timeoutMs=${timeoutMs}`,
      ],
    },
    {
      name: 'typecheck',
      command: 'node',
      commandArgs: [
        'scripts/validate-workspace-segmented.mjs',
        '--script=typecheck',
        `--scope=${workspaceScope}`,
        `--timeoutMs=${timeoutMs}`,
      ],
    },
    {
      name: 'test:segmented',
      command: 'node',
      commandArgs: [
        'scripts/test-segmented.mjs',
        '--type=all',
        '--chunk=20',
        `--scope=${segmentedScope}`,
      ],
    },
  )
}

if (includeBuild) {
  steps.push(
    buildScope
      ? { name: 'build', command: 'pnpm', commandArgs: ['-C', buildScope, 'build'] }
      : { name: 'build', command: 'pnpm', commandArgs: ['build'] },
  )
}

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

// eslint-disable-next-line no-console
console.log(
  `${COLORS.BLUE}${COLORS.BOLD}🧪 quality gate runner start (${steps.length} gates; each gate is a top-level validation metric)${COLORS.RESET}`,
)

for (const [idx, step] of steps.entries()) {
  const started = Date.now()
  const remaining = steps.length - idx - 1
  // eslint-disable-next-line no-console
  console.log(
    `${COLORS.MAGENTA}\n[${idx + 1}/${steps.length}] 📚 quality gate: ${step.name} (${formatRemaining(remaining)}; gate scope = ${step.name})${COLORS.RESET}`,
  )

  const result = spawnSync(step.command, step.commandArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    timeout: timeoutMs,
  })

  const elapsedMs = Date.now() - started
  if (result.status === null && result.error && result.error.code === 'ETIMEDOUT') {
    // eslint-disable-next-line no-console
    console.error(
      `${COLORS.RED}${COLORS.BOLD}❌ Timed out: quality gate ${step.name} after ${Math.round(timeoutMs / 1000)}s${COLORS.RESET}`,
    )
    process.exit(124)
  }

  if (result.status !== 0) {
    // eslint-disable-next-line no-console
    console.error(
      `${COLORS.RED}${COLORS.BOLD}❌ Failed: quality gate ${step.name} (${elapsedMs}ms)${COLORS.RESET}`,
    )
    process.exit(result.status ?? 1)
  }

  // eslint-disable-next-line no-console
  console.log(
    `${COLORS.GREEN}✅ Passed: quality gate ${step.name} (${elapsedMs}ms)${COLORS.RESET}`,
  )
}

// eslint-disable-next-line no-console
console.log(`\n${COLORS.BLUE}${COLORS.BOLD}✅ quality gate runner complete.${COLORS.RESET}`)
