#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  WHITE: '\x1b[97m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const ROOT = process.cwd()
const complianceDir = path.join(ROOT, 'compliance')
const appStatusPath = path.join(complianceDir, 'app-status.json')
const featureMatrixPath = path.join(complianceDir, 'feature-implementation-matrix.json')
const matrixPath = path.join(complianceDir, 'matrix.json')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function fail(message) {
  console.error(`${COLORS.RED}${COLORS.BOLD}❌ ERROR: ${message}${COLORS.RESET}`)
  process.exit(1)
}

function assertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(ROOT, filePath)}`)
  }
}

function run() {
  assertFile(appStatusPath)
  assertFile(featureMatrixPath)
  assertFile(matrixPath)

  const appStatus = readJson(appStatusPath)
  const featureMatrix = readJson(featureMatrixPath)
  const matrix = readJson(matrixPath)

  const appIds = new Set((appStatus.apps || []).map((app) => app.id))
  const matrixGames = new Set((matrix.games || []).map((game) => String(game)))

  if (appIds.size === 0) {
    fail('app-status.json has no apps')
  }

  for (const appId of appIds) {
    if (!matrixGames.has(appId)) {
      fail(`matrix.json missing app from app-status.json: ${appId}`)
    }
  }

  for (const game of matrixGames) {
    if (!appIds.has(game)) {
      fail(`matrix.json contains unknown app not in app-status.json: ${game}`)
    }
  }

  const features = featureMatrix.features || {}
  for (const [featureKey, feature] of Object.entries(features)) {
    for (const appName of feature.implementedBy || []) {
      if (!appIds.has(appName)) {
        fail(`feature-implementation-matrix.json contains unknown app in ${featureKey}: ${appName}`)
      }
    }
  }

  const appById = Object.fromEntries((appStatus.apps || []).map((app) => [app.id, app]))
  for (const appId of appIds) {
    const app = appById[appId]
    const webCell = matrix.matrix?.[appId]?.web
    if (!webCell) {
      fail(`matrix.json missing web cell for app: ${appId}`)
    }
    if (app.readyForPromotion && webCell.status === 'not-started') {
      fail(`readyForPromotion app has web status not-started: ${appId}`)
    }
  }

  console.log(
    `Consistency PASS: ${appIds.size} apps aligned across app-status.json, feature-implementation-matrix.json, and matrix.json`,
  )
}

run()
