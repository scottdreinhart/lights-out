#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-')
const outDir = path.join(process.cwd(), 'reports', 'validation', TIMESTAMP)
fs.mkdirSync(outDir, { recursive: true })

function run(command, args, opts = {}) {
  const start = Date.now()
  const res = spawnSync(command, args, { encoding: 'utf8', shell: true, ...opts })
  const elapsed = Date.now() - start
  return { command: [command, ...args].join(' '), status: res.status ?? null, stdout: res.stdout ?? '', stderr: res.stderr ?? '', elapsed }
}

const args = process.argv.slice(2)
const skipValidation = args.includes('--skip-validation')

const bundles = [
  { name: 'CHECK_BASIC', command: 'pnpm', args: ['--version'] },
  { name: 'NODE', command: 'node', args: ['-v'] },
  { name: 'SHELL_CHECK', command: 'bash', args: ['-c', "echo ok"] },
]

if (!skipValidation) {
  bundles.push({ name: 'CHECK_VALIDATION', command: 'pnpm', args: ['validate'] })
}

const results = []
for (const b of bundles) {
  console.log(`Running bundle: ${b.name}`)
  const r = run(b.command, b.args)
  results.push({ bundle: b.name, ...r })
  fs.appendFileSync(path.join(outDir, `${b.name}.log`), `COMMAND: ${r.command}\nSTATUS: ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}\n`)
  if (r.status !== 0) {
    console.error(`Bundle ${b.name} failed with status ${r.status}. See ${b.name}.log`)
  }
}

fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify({ timestamp: TIMESTAMP, results }, null, 2))
console.log(`Validation artifacts written to ${outDir}`)
