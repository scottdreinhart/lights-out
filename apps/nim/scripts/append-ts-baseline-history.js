import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const reportPath = path.join(projectRoot, '.ts-perf-runs', 'median-report.txt')
const diagPath = path.join(projectRoot, '.ts-perf-runs', 'diag-clean.txt')
const tracePath = path.join(projectRoot, '.ts-trace', 'trace.json')

const historyHeader = '---\nbaseline_history\nformat=date_utc,total_s,program_s,resolveModule_s,check_s,findSourceFile_ms,processRootFiles_ms,resolveModuleNamesWorker_ms,note\n'

const readDiagMetric = (diagText, label) => {
  const line = diagText
    .split('\n')
    .find((entry) => entry.includes(label))

  if (!line) {
    throw new Error(`Missing metric: ${label}`)
  }

  return line.trim().split(/\s+/).pop().replace('s', '')
}

const aggregateTrace = (traceEvents) => {
  const totals = {
    findSourceFile_ms: 0,
    processRootFiles_ms: 0,
    resolveModuleNamesWorker_ms: 0,
  }

  for (const event of traceEvents) {
    if (event.ph !== 'X' || typeof event.dur !== 'number') {
      continue
    }

    if (event.name === 'findSourceFile') {
      totals.findSourceFile_ms += event.dur / 1000
    }
    if (event.name === 'processRootFiles') {
      totals.processRootFiles_ms += event.dur / 1000
    }
    if (event.name === 'resolveModuleNamesWorker') {
      totals.resolveModuleNamesWorker_ms += event.dur / 1000
    }
  }

  return {
    findSourceFile_ms: totals.findSourceFile_ms.toFixed(2),
    processRootFiles_ms: totals.processRootFiles_ms.toFixed(2),
    resolveModuleNamesWorker_ms: totals.resolveModuleNamesWorker_ms.toFixed(2),
  }
}

if (!fs.existsSync(diagPath)) {
  throw new Error(`Missing diagnostics input: ${diagPath}`)
}
if (!fs.existsSync(tracePath)) {
  throw new Error(`Missing trace input: ${tracePath}`)
}

const diagText = fs.readFileSync(diagPath, 'utf8')
const traceEvents = JSON.parse(fs.readFileSync(tracePath, 'utf8'))
const traceTotals = aggregateTrace(traceEvents)

const generatedUtc = new Date().toISOString()
const total = readDiagMetric(diagText, 'Total time')
const program = readDiagMetric(diagText, 'Program time')
const resolveModule = readDiagMetric(diagText, 'ResolveModule time')
const check = readDiagMetric(diagText, 'Check time')

const baselineLines = [
  'TS stable baseline',
  'baseline_type=clean_followup_single_pass',
  `generated_utc=${generatedUtc}`,
  `total_s=${total}`,
  `program_s=${program}`,
  `resolveModule_s=${resolveModule}`,
  `check_s=${check}`,
  `findSourceFile_ms=${traceTotals.findSourceFile_ms}`,
  `processRootFiles_ms=${traceTotals.processRootFiles_ms}`,
  `resolveModuleNamesWorker_ms=${traceTotals.resolveModuleNamesWorker_ms}`,
  'source_diag=.ts-perf-runs/diag-clean.txt',
  'source_trace=.ts-trace/trace.json',
]

const historyRow = [
  generatedUtc,
  total,
  program,
  resolveModule,
  check,
  traceTotals.findSourceFile_ms,
  traceTotals.processRootFiles_ms,
  traceTotals.resolveModuleNamesWorker_ms,
  'clean_followup_single_pass_locked',
].join(',')

let existingHistoryRows = []
if (fs.existsSync(reportPath)) {
  const existing = fs.readFileSync(reportPath, 'utf8')
  const marker = 'format=date_utc,total_s,program_s,resolveModule_s,check_s,findSourceFile_ms,processRootFiles_ms,resolveModuleNamesWorker_ms,note\n'
  const markerIndex = existing.indexOf(marker)
  if (markerIndex >= 0) {
    const rowsBlock = existing.slice(markerIndex + marker.length).trim()
    if (rowsBlock.length > 0) {
      existingHistoryRows = rowsBlock
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
    }
  }
}

const finalHistoryRows = [...existingHistoryRows, historyRow]
const nextText = `${baselineLines.join('\n')}\n\n${historyHeader}${finalHistoryRows.join('\n')}\n`

fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, nextText)

console.log(`Updated ${path.relative(projectRoot, reportPath)} with baseline + appended history row.`)
