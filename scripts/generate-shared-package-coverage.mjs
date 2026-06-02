#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')
const packagesDir = path.join(rootDir, 'packages')
const complianceDir = path.join(rootDir, 'compliance')
const outputPath = path.join(complianceDir, 'shared-package-coverage.json')

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function listAppDirectories() {
  if (!fs.existsSync(appsDir)) return []
  return fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'ui')
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(appsDir, name, 'package.json')))
    .sort((a, b) => a.localeCompare(b))
}

function listSharedPackages() {
  if (!fs.existsSync(packagesDir)) return []
  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const packageJsonPath = path.join(packagesDir, entry.name, 'package.json')
      if (!fs.existsSync(packageJsonPath)) return null
      const pkg = readJson(packageJsonPath)
      return {
        id: pkg.name,
        folder: entry.name,
        version: pkg.version,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id))
}

function readDependencySections(packageJson) {
  return {
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
    peerDependencies: packageJson.peerDependencies || {},
    optionalDependencies: packageJson.optionalDependencies || {},
  }
}

function sectionForPackage(sections, packageName) {
  const hits = []
  if (sections.dependencies[packageName]) hits.push('dependencies')
  if (sections.devDependencies[packageName]) hits.push('devDependencies')
  if (sections.peerDependencies[packageName]) hits.push('peerDependencies')
  if (sections.optionalDependencies[packageName]) hits.push('optionalDependencies')
  return hits
}

function generateCoverage() {
  const apps = listAppDirectories()
  const sharedPackages = listSharedPackages()
  const appRows = []
  const packageUsageCounts = Object.fromEntries(sharedPackages.map((pkg) => [pkg.id, 0]))
  const packageUsageApps = Object.fromEntries(sharedPackages.map((pkg) => [pkg.id, []]))
  const matrix = {}

  for (const appName of apps) {
    const appPackageJsonPath = path.join(appsDir, appName, 'package.json')
    const appPackageJson = readJson(appPackageJsonPath)
    const sections = readDependencySections(appPackageJson)

    matrix[appName] = {}
    const usedPackages = []

    for (const sharedPkg of sharedPackages) {
      const sectionHits = sectionForPackage(sections, sharedPkg.id)
      const inUse = sectionHits.length > 0
      const version =
        sections.dependencies[sharedPkg.id] ||
        sections.devDependencies[sharedPkg.id] ||
        sections.peerDependencies[sharedPkg.id] ||
        sections.optionalDependencies[sharedPkg.id] ||
        null

      matrix[appName][sharedPkg.id] = {
        used: inUse,
        version,
        sections: sectionHits,
      }

      if (inUse) {
        usedPackages.push(sharedPkg.id)
        packageUsageCounts[sharedPkg.id] += 1
      }
    }

    appRows.push({
      app: appName,
      usedPackageCount: usedPackages.length,
      usedPackages,
      usesAnySharedPackage: usedPackages.length > 0,
    })
  }

  for (const sharedPkg of sharedPackages) {
    packageUsageApps[sharedPkg.id] = appRows
      .filter((row) => row.usedPackages.includes(sharedPkg.id))
      .map((row) => row.app)
      .sort((a, b) => a.localeCompare(b))
  }

  const packageRows = sharedPackages.map((pkg) => ({
    package: pkg.id,
    folder: pkg.folder,
    version: pkg.version,
    usageCount: packageUsageCounts[pkg.id],
    usagePercent: apps.length > 0 ? Number(((packageUsageCounts[pkg.id] / apps.length) * 100).toFixed(1)) : 0,
    apps: packageUsageApps[pkg.id],
  }))

  const appsUsingAnySharedPackage = appRows.filter((row) => row.usesAnySharedPackage).length
  const totalCells = apps.length * sharedPackages.length
  const usedCells = appRows.reduce((sum, row) => sum + row.usedPackageCount, 0)

  return {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      source: 'scripts/generate-shared-package-coverage.mjs',
      notes: [
        'Usage is derived from app package.json dependency sections.',
        'Rows are apps, columns are shared workspace packages in /packages.',
      ],
    },
    summary: {
      appCount: apps.length,
      sharedPackageCount: sharedPackages.length,
      appsUsingAnySharedPackage,
      appsUsingAnySharedPackagePercent:
        apps.length > 0 ? Number(((appsUsingAnySharedPackage / apps.length) * 100).toFixed(1)) : 0,
      totalMatrixCells: totalCells,
      usedMatrixCells: usedCells,
      matrixUtilizationPercent: totalCells > 0 ? Number(((usedCells / totalCells) * 100).toFixed(1)) : 0,
    },
    apps: appRows,
    sharedPackages: packageRows,
    matrix,
  }
}

function writeCoverage(coverage) {
  fs.mkdirSync(complianceDir, { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(coverage, null, 2))
}

function main() {
  const coverage = generateCoverage()
  writeCoverage(coverage)
  // eslint-disable-next-line no-console
  console.log(
    `Generated shared-package-coverage.json (${coverage.summary.appCount} apps x ${coverage.summary.sharedPackageCount} shared packages)`,
  )
}

main()
