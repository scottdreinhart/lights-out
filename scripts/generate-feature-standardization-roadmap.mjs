#!/usr/bin/env node
/* global console, process */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const matrixFile = path.join(rootDir, 'compliance', 'feature-implementation-matrix.json')
const outputFile = path.join(rootDir, 'compliance', 'FEATURE_STANDARDIZATION_ROADMAP.md')

const canonicalAppNames = new Map([['choose-han', 'cho-han']])

function normalizeAppName(appName) {
  return canonicalAppNames.get(appName) ?? appName
}

function sortNames(names) {
  return [...new Set(names)].sort((left, right) => left.localeCompare(right))
}

function formatList(values) {
  return values.length > 0 ? values.join(', ') : 'None'
}

function countImplementation(feature, appCount) {
  const implemented = new Set((feature.implemented || []).map(normalizeAppName))
  const partial = new Set((feature.partialOrInProgress || []).map(normalizeAppName))
  const notImplemented = new Set((feature.notImplemented || []).map(normalizeAppName))

  const allApps = sortNames([...implemented, ...partial, ...notImplemented])

  return {
    implemented: implemented.size,
    partial: partial.size,
    notImplemented: notImplemented.size,
    total: appCount || allApps.length,
  }
}

async function main() {
  const raw = await fs.readFile(matrixFile, 'utf8')
  const data = JSON.parse(raw)
  const features = data.features || {}

  const allApps = sortNames(
    Object.values(features).flatMap((feature) =>
      [
        ...(feature.implemented || []),
        ...(feature.partialOrInProgress || []),
        ...(feature.notImplemented || []),
      ].map(normalizeAppName),
    ),
  )

  const appFeatureMap = new Map()

  for (const app of allApps) {
    appFeatureMap.set(app, { implemented: [], partial: [], missing: [] })
  }

  const featureRows = []

  for (const [featureKey, feature] of Object.entries(features)) {
    const implemented = sortNames((feature.implemented || []).map(normalizeAppName))
    const partial = sortNames((feature.partialOrInProgress || []).map(normalizeAppName))
    const missing = sortNames((feature.notImplemented || []).map(normalizeAppName))

    for (const app of implemented) {
      if (!appFeatureMap.has(app)) continue
      appFeatureMap.get(app).implemented.push(featureKey)
    }

    for (const app of partial) {
      if (!appFeatureMap.has(app)) continue
      appFeatureMap.get(app).partial.push(featureKey)
    }

    for (const app of missing) {
      if (!appFeatureMap.has(app)) continue
      appFeatureMap.get(app).missing.push(featureKey)
    }

    const counts = countImplementation(feature, allApps.length)
    const adoption = Math.round((counts.implemented / counts.total) * 100)

    featureRows.push({
      key: featureKey,
      name: feature.name,
      implemented: counts.implemented,
      partial: counts.partial,
      missing: counts.notImplemented,
      adoption,
    })
  }

  featureRows.sort((left, right) => {
    if (left.adoption !== right.adoption) return left.adoption - right.adoption
    return left.key.localeCompare(right.key)
  })

  const fullyCompliantApps = sortNames(
    allApps.filter(
      (app) => appFeatureMap.get(app).missing.length === 0 && appFeatureMap.get(app).partial.length === 0,
    ),
  )

  const nonCompliantApps = sortNames(
    allApps.filter(
      (app) => appFeatureMap.get(app).missing.length > 0 || appFeatureMap.get(app).partial.length > 0,
    ),
  )

  const sharedPackageApps = sortNames(
    allApps.filter((app) => {
      const featuresForApp = appFeatureMap.get(app)
      return featuresForApp.implemented.length >= 3
    }),
  )

  const appRows = nonCompliantApps.map((app) => {
    const featuresForApp = appFeatureMap.get(app)
    return {
      app,
      implemented: featuresForApp.implemented.length,
      partial: featuresForApp.partial.length,
      missing: featuresForApp.missing.length,
      gaps: sortNames([...featuresForApp.partial, ...featuresForApp.missing]),
    }
  })

  const lines = []
  lines.push('# Feature Standardization Roadmap')
  lines.push('')
  lines.push(`Generated from \`compliance/feature-implementation-matrix.json\` on ${new Date().toISOString()}`)
  lines.push('')
  lines.push('## Scope Summary')
  lines.push('')
  lines.push(`- Feature matrix scope: ${allApps.length} apps, ${featureRows.length} standard features`)
  lines.push(`- Fully compliant apps: ${fullyCompliantApps.length}`)
  lines.push(`- Non-compliant apps: ${nonCompliantApps.length}`)
  lines.push('')
  lines.push('## 1. Standard Feature Adoption')
  lines.push('')
  lines.push('| Feature | Implemented | Partial | Missing | Adoption |')
  lines.push('| --- | ---: | ---: | ---: | ---: |')

  for (const row of featureRows) {
    lines.push(`| ${row.name} | ${row.implemented} | ${row.partial} | ${row.missing} | ${row.adoption}% |`)
  }

  lines.push('')
  lines.push('## 2. Recommended Rollout Order')
  lines.push('')
  lines.push(
    'Start with the lowest-adoption features, because they unlock the widest consistency gains across the app set.',
  )
  lines.push('')
  lines.push('| Order | Feature | Why it comes first |')
  lines.push('| --- | --- | --- |')

  featureRows.forEach((row, index) => {
    const reason =
      index === 0
        ? 'Lowest adoption; establishes shared navigation and settings affordance'
        : index === 1
          ? 'Reusable shell surface; easy to propagate after menu integration'
          : index === 2
            ? 'User guidance surface; depends on the same modal shell pattern'
            : index === 3
              ? 'Branding and structure; applies with the same header template'
              : row.key === 'responsive-design'
                ? 'Foundational layout consistency'
                : row.key === 'accessibility-wcag-aa'
                  ? 'Compliance-critical and should be completed after shell surfaces are stable'
                  : 'Polish and theme consistency'

    lines.push(`| ${index + 1} | ${row.name} | ${reason} |`)
  })

  lines.push('')
  lines.push('## 3. Shared-Package Rollout Cluster')
  lines.push('')
  lines.push(
    'These apps are the best candidates for rollout first because they already appear to be using shared platform primitives or have the most implementation surface in place.',
  )
  lines.push('')
  lines.push(`- ${sharedPackageApps.length > 0 ? sharedPackageApps.join(', ') : 'None'}`)

  lines.push('')
  lines.push('## 4. Fully Compliant Apps')
  lines.push('')
  lines.push(fullyCompliantApps.length > 0 ? `- ${fullyCompliantApps.join(', ')}` : '- None')

  lines.push('')
  lines.push('## 5. Per-App Gap Checklist')
  lines.push('')
  lines.push('| App | Implemented | Partial | Missing | Gap Features |')
  lines.push('| --- | ---: | ---: | ---: | --- |')

  for (const row of appRows) {
    lines.push(`| ${row.app} | ${row.implemented} | ${row.partial} | ${row.missing} | ${formatList(row.gaps)} |`)
  }

  lines.push('')
  lines.push('## 6. Current Non-Compliant Apps')
  lines.push('')
  lines.push(nonCompliantApps.length > 0 ? `- ${nonCompliantApps.join(', ')}` : '- None')
  lines.push('')
  lines.push('## 7. Data Notes')
  lines.push('')
  lines.push('- `cho-han` is the normalized app name for the `choose-han` typo present in the source matrix data.')
  lines.push(
    '- This report is derived from the existing feature matrix and reflects the current implementation state, not a simulated target state.',
  )

  await fs.writeFile(outputFile, lines.join('\n') + '\n', 'utf8')

  console.log(`Generated ${outputFile}`)
  console.log(`Apps: ${allApps.length}`)
  console.log(`Fully compliant: ${fullyCompliantApps.length}`)
  console.log(`Non-compliant: ${nonCompliantApps.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})