#!/usr/bin/env node
/**
 * Phase 1 Migration: move UI hook imports to @games/ui-hooks.
 *
 * This script rewrites app-local imports for the shared UI hook surface:
 * - createUseThemeHook
 * - createUseSoundEffectsHook and associated sound-effect types
 * - useResponsiveState
 *
 * It preserves mixed imports by splitting lines when only part of the import
 * list belongs in @games/ui-hooks.
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const PROJECT_ROOT = resolve(process.cwd())
const APPS_DIR = resolve(PROJECT_ROOT, 'apps')

const UI_HOOK_IMPORTS = new Set([
  'createUseThemeHook',
  'createUseSoundEffectsHook',
  'createUseContextSoundEffectsHook',
  'createUseToggleableSoundEffectsHook',
  'createUseStatsHook',
  'StandardSoundEffects',
  'ToggleableSoundEffects',
  'ThemeSettingsShape',
  'UseThemeResult',
  'UseStatsResult',
  'ResponsiveState',
  'useResponsiveState',
])

function walk(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = resolve(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(fullPath))
      continue
    }

    if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      files.push(fullPath)
    }
  }

  return files
}

function collectHookFiles() {
  const appEntries = readdirSync(APPS_DIR, { withFileTypes: true })
  const files = []

  for (const entry of appEntries) {
    if (!entry.isDirectory()) {
      continue
    }

    const hookDir = resolve(APPS_DIR, entry.name, 'src', 'app', 'hooks')
    try {
      files.push(...walk(hookDir))
    } catch {
      continue
    }
  }

  return files
}

function splitImportSpecifiers(specifierText) {
  return specifierText
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

function formatImport(specifiers, source) {
  return `import { ${specifiers.join(', ')} } from '${source}'`
}

function rewriteImportLine(line) {
  const importMatch = line.match(/^(\s*import\s*\{)([^}]+)(\}\s*from\s*['"]@games\/app-hook-utils['"]\s*;?\s*)$/)
  if (!importMatch) {
    return { changed: false, lines: [line] }
  }

  const [, , specifierText] = importMatch
  const specifiers = splitImportSpecifiers(specifierText)
  const uiHookSpecifiers = []
  const remainingSpecifiers = []

  for (const specifier of specifiers) {
    const normalized = specifier.replace(/^type\s+/, '').trim()
    if (UI_HOOK_IMPORTS.has(normalized)) {
      uiHookSpecifiers.push(specifier)
    } else {
      remainingSpecifiers.push(specifier)
    }
  }

  if (uiHookSpecifiers.length === 0) {
    return { changed: false, lines: [line] }
  }

  const rewrittenLines = []

  if (remainingSpecifiers.length > 0) {
    rewrittenLines.push(formatImport(remainingSpecifiers, '@games/app-hook-utils'))
  }

  rewrittenLines.push(formatImport(uiHookSpecifiers, '@games/ui-hooks'))

  return {
    changed: true,
    lines: rewrittenLines,
  }
}

function rewriteExportLine(line) {
  const exportMatch = line.match(/^(\s*export(?:\s+type)?\s*\{)([^}]+)(\}\s*from\s*['"]@games\/app-hook-utils['"]\s*;?\s*)$/)
  if (!exportMatch) {
    return { changed: false, lines: [line] }
  }

  const [, prefix, specifierText] = exportMatch
  const specifiers = splitImportSpecifiers(specifierText)
  const uiHookSpecifiers = []
  const remainingSpecifiers = []

  for (const specifier of specifiers) {
    const normalized = specifier.replace(/^type\s+/, '').trim()
    if (UI_HOOK_IMPORTS.has(normalized)) {
      uiHookSpecifiers.push(specifier)
    } else {
      remainingSpecifiers.push(specifier)
    }
  }

  if (uiHookSpecifiers.length === 0) {
    return { changed: false, lines: [line] }
  }

  const rewrittenLines = []

  if (remainingSpecifiers.length > 0) {
    rewrittenLines.push(`${prefix} ${remainingSpecifiers.join(', ')} } from '@games/app-hook-utils'`)
  }

  rewrittenLines.push(`${prefix} ${uiHookSpecifiers.join(', ')} } from '@games/ui-hooks'`)

  return {
    changed: true,
    lines: rewrittenLines,
  }
}

function rewriteFile(content) {
  const inputLines = content.split(/\r?\n/)
  const outputLines = []
  let changed = false

  for (const line of inputLines) {
    const exportRewrite = rewriteExportLine(line)
    if (exportRewrite.changed) {
      changed = true
      outputLines.push(...exportRewrite.lines)
      continue
    }

    const importRewrite = rewriteImportLine(line)
    if (importRewrite.changed) {
      changed = true
      outputLines.push(...importRewrite.lines)
      continue
    }

    outputLines.push(line)
  }

  return {
    changed,
    content: outputLines.join('\n'),
  }
}

const files = collectHookFiles().sort()
const changedFiles = []

console.log(`Scanning ${files.length} hook file(s) for Phase 1 UI hook imports`)

for (const filePath of files) {
  const original = readFileSync(filePath, 'utf-8')
  if (!original.includes('@games/app-hook-utils')) {
    continue
  }

  const next = rewriteFile(original)
  if (!next.changed || next.content === original) {
    continue
  }

  writeFileSync(filePath, next.content.endsWith('\n') ? next.content : `${next.content}\n`, 'utf-8')
  changedFiles.push(filePath)
}

console.log(`Migrated ${changedFiles.length} file(s) to @games/ui-hooks`)
for (const filePath of changedFiles) {
  console.log(`- ${filePath}`)
}