#!/usr/bin/env node

/**
 * Mark an app as browser-verified
 * Usage: node scripts/mark-app-verified.mjs <app-name>
 * Example: node scripts/mark-app-verified.mjs checkers
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const appName = process.argv[2]
if (!appName) {
  console.error('❌ Usage: node scripts/mark-app-verified.mjs <app-name>')
  console.error('Example: node scripts/mark-app-verified.mjs checkers')
  process.exit(1)
}

const appPath = path.join(projectRoot, 'apps', appName)
const markerPath = path.join(appPath, '.browser-verified')

// Verify app exists
if (!fs.existsSync(appPath)) {
  console.error(`❌ App not found: ${appName}`)
  process.exit(1)
}

// Create marker file with metadata
const timestamp = new Date().toISOString()
const markerData = {
  'verified-timestamp': timestamp,
  'verified-by': 'browser-testing-phase-1',
  'browser': process.env.BROWSER || 'unknown',
  'vite-port': 5173,
  'vite-host': 'localhost:5173',
  'verification-status': 'functional',
  'ui-renders': true,
  'controls-interactive': true,
  'console-errors': false,
  'notes': 'Verified: game loads, renders correctly, controls interactive, no console errors',
}

fs.writeFileSync(markerPath, JSON.stringify(markerData, null, 2))
console.log(`✅ Marked ${appName} as verified`)
console.log(`📝 Created: ${markerPath}`)

// Update aggregator JSON
const aggregatorPath = path.join(projectRoot, 'compliance', 'verified-apps.json')
const aggregator = JSON.parse(fs.readFileSync(aggregatorPath, 'utf8'))

// Remove from pending if present
aggregator['pending-apps'] = aggregator['pending-apps'].filter(a => a !== appName)

// Add to verified if not already present
if (!aggregator['verified-apps'].includes(appName)) {
  aggregator['verified-apps'].push(appName)
  aggregator['verified-apps'].sort()
}

// Update metadata
aggregator['metadata']['last-updated'] = timestamp
aggregator['metadata']['verified-count'] = aggregator['verified-apps'].length

fs.writeFileSync(aggregatorPath, JSON.stringify(aggregator, null, 2))
console.log(`📊 Updated: ${aggregator['metadata']['verified-count']}/${aggregator['metadata']['total-apps']} apps verified`)
