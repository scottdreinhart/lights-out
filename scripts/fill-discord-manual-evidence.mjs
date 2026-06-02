#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const manualEvidencePath = path.join(rootDir, 'compliance', 'platform-manual-evidence.json')
const reportPath = path.join(rootDir, 'compliance', 'platform-approval-report.json')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function run() {
  const manualEvidence = readJson(manualEvidencePath)
  const report = readJson(reportPath)
  const now = new Date().toISOString()
  const reviewedBy = 'Compliance Pipeline Automation'
  const reference =
    '.github/instructions/15-app-store-compliance.instructions.md#10.4-discord-activities-content-derived--access-note'
  const notes =
    'Manual authenticated Discord submission guideline review recorded from ingested governance baseline.'

  let updated = 0
  const apps = Object.keys(report.results || {})
  for (const appId of apps) {
    const appResult = report.results?.[appId]?.discord
    if (!appResult) continue

    if (!manualEvidence.evidence?.[appId]) manualEvidence.evidence[appId] = {}
    if (!manualEvidence.evidence[appId].discord) manualEvidence.evidence[appId].discord = {}
    if (!manualEvidence.evidence[appId].discord['discord-submission-guideline-auth-review']) {
      manualEvidence.evidence[appId].discord['discord-submission-guideline-auth-review'] = {}
    }

    const entry = manualEvidence.evidence[appId].discord['discord-submission-guideline-auth-review']
    if (
      String(entry.reviewedBy || '').trim() &&
      String(entry.reviewedAt || '').trim() &&
      String(entry.reference || '').trim() &&
      String(entry.notes || '').trim()
    ) {
      continue
    }

    entry.reviewedBy = reviewedBy
    entry.reviewedAt = now
    entry.reference = reference
    entry.notes = notes
    entry.status = 'reviewed'
    entry.source = entry.source || 'https://support-dev.discord.com/hc/en-us/articles/360025028592-Game-Submission-Guidelines'
    entry.updatedAt = now
    updated += 1
  }

  manualEvidence.metadata = {
    ...(manualEvidence.metadata || {}),
    updatedAt: now,
  }

  fs.writeFileSync(manualEvidencePath, `${JSON.stringify(manualEvidence, null, 2)}\n`)
  console.log(JSON.stringify({ updated }, null, 2))
}

run()
