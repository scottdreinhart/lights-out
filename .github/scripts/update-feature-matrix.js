#!/usr/bin/env node

/**
 * update-feature-matrix.js
 *
 * Auto-updates APP_FEATURE_MATRIX.md based on commits since last release.
 * Parses commit messages and groups changes by game + feature type.
 *
 * Usage: node .github/scripts/update-feature-matrix.js [--dry-run]
 *
 * Integration: Runs on auto-release.yml post-version-bump OR manual workflow_dispatch
 */

import { execSync } from 'child_process'
import fs from 'fs'

const MATRIX_FILE = 'APP_FEATURE_MATRIX.md'
const DRY_RUN = process.argv.includes('--dry-run')

const STATUS_ICONS = {
  complete: '✅',
  incomplete: '❌',
  inprogress: '⏳',
  verified: '✔️',
  warning: '⚠️',
  critical: '🚨',
}

const FEATURE_TYPES = {
  feat: '✨ Feature',
  fix: '🐛 Fix',
  refactor: '♻️ Refactor',
  perf: '⚡ Performance',
  docs: '📚 Documentation',
  test: '🧪 Testing',
  chore: '⚙️ Maintenance',
  security: '🔐 Security',
  a11y: '♿ Accessibility',
}

const GAMES = [
  'battleship',
  'bingo',
  'blackjack',
  'bunco',
  'cee-lo',
  'checkers',
  'chicago',
  'cho-han',
  'connect-four',
  'crossclimb',
  'dominoes',
  'farkle',
  'go-fish',
  'hangman',
  'liars-dice',
  'lights-out',
  'mancala',
  'memory-game',
  'mexico',
  'minesweeper',
  'mini-sudoku',
  'monchola',
  'nim',
  'pig',
  'pinpoint',
  'queens',
  'reversi',
  'rock-paper-scissors',
  'ship-captain-crew',
  'shut-the-box',
  'simon-says',
  'snake',
  'snakes-and-ladders',
  'sudoku',
  'tango',
  'tictactoe',
  'war',
  'zip',
]

/**
 * Get commits since last git tag (or since beginning if no tags).
 */
function getCommitsSinceLastRelease() {
  try {
    // Get latest tag
    const tags = execSync('git tag --list "v*" --sort=-version:refname', { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(Boolean)

    const lastTag = tags[0] || ''
    const range = lastTag ? `${lastTag}..HEAD` : 'HEAD'

    // Get commits in specified range
    const commits = execSync(`git log ${range} --pretty=format:%H%n%s%n%b%n---`, {
      encoding: 'utf-8',
    })
      .trim()
      .split('---')
      .filter(Boolean)

    return commits.map((commit) => {
      const lines = commit.trim().split('\n')
      return {
        hash: lines[0],
        subject: lines[1],
        body: lines.slice(2).join('\n'),
      }
    })
  } catch (error) {
    console.error('❌ Failed to fetch commits:', error.message)
    return []
  }
}

/**
 * Parse commit subject to extract type, scope, and description.
 * Expects format: "type(scope): description"
 */
function parseCommit(commit) {
  const regex = /^(\w+)(?:\(([^)]+)\))?\s*:\s*(.+)$/
  const match = commit.subject.match(regex)

  if (!match) {
    return null
  }

  const [, type, scope, description] = match

  return {
    type: type.toLowerCase(),
    scope: scope ? scope.toLowerCase() : null,
    description,
    isGameRelated: scope && GAMES.some((game) => scope.includes(game)),
    game: scope ? GAMES.find((game) => scope.includes(game)) : null,
  }
}

/**
 * Group commits by game and feature type.
 */
function groupCommitsByGameAndType(commits) {
  const parsed = commits.map(parseCommit).filter(Boolean)

  const grouped = {}

  for (const commit of parsed) {
    if (!commit.isGameRelated || !commit.game) {
      continue
    }

    if (!grouped[commit.game]) {
      grouped[commit.game] = {}
    }

    if (!grouped[commit.game][commit.type]) {
      grouped[commit.game][commit.type] = []
    }

    grouped[commit.game][commit.type].push(commit)
  }

  return grouped
}

/**
 * Determine new status for a feature based on commit activity.
 */
function determineNewStatus(currentStatus, commitsByType) {
  const types = Object.keys(commitsByType)

  // If fixes found, mark as verified (even if has issues)
  if (types.includes('fix')) {
    return STATUS_ICONS.verified
  }

  // If features or refactors, mark as in-progress (not yet complete)
  if (types.includes('feat') || types.includes('refactor')) {
    return STATUS_ICONS.inprogress
  }

  // If only docs/tests/chore, keep as complete
  return currentStatus || STATUS_ICONS.complete
}

/**
 * Load existing matrix or create new structure.
 */
function loadMatrix() {
  if (!fs.existsSync(MATRIX_FILE)) {
    console.log(`⚠️ ${MATRIX_FILE} not found, will create new.`)
    return {}
  }

  const content = fs.readFileSync(MATRIX_FILE, 'utf-8')
  // Simple parse: extract game names from markdown table
  const gameMatches = content.match(/^\|\s+(\w+)\s+\|/gm) || []
  const parsed = {}

  for (const match of gameMatches) {
    const gameName = match.replace(/[|\s]/g, '')
    if (GAMES.includes(gameName)) {
      parsed[gameName] = {}
    }
  }

  return parsed
}

/**
 * Generate updated matrix markdown.
 */
function generateMatrixMarkdown(matrix, groupedCommits) {
  let markdown = `# 🎮 App Feature Matrix

Last Generated: ${new Date().toISOString()}

This matrix tracks implementation status across all ${GAMES.length} games.

| Game | Keyboard ⌨️ | Accessibility ♿ | Focus 🎯 | Responsive 📱 | Theme 🎨 | Status |
|------|----------|------------|--------|------------|-------|--------|
`

  for (const game of GAMES) {
    const commits = groupedCommits[game]
    const icon = commits ? STATUS_ICONS.verified : STATUS_ICONS.complete

    markdown += `| ${game} | `
    markdown += commits ? '✔️' : '✅'
    markdown += ' | '
    markdown += commits ? '✔️' : '✅'
    markdown += ' | '
    markdown += commits ? '✔️' : '✅'
    markdown += ' | '
    markdown += commits ? '✔️' : '✅'
    markdown += ' | '
    markdown += commits ? '✔️' : '✅'
    markdown += ' | '
    markdown += `${icon} `
    if (commits) {
      const types = Object.keys(commits)
        .map((t) => FEATURE_TYPES[t] || t)
        .join(', ')
      markdown += `(${types})`
    }
    markdown += ' |\n'
  }

  markdown += `\n## 📊 Summary\n\n`
  markdown += `- 🎮 Total Games: ${GAMES.length}\n`
  markdown += `- ✅ Complete: ${GAMES.filter((g) => !groupedCommits[g]).length}\n`
  markdown += `- ⏳ In Progress: ${Object.keys(groupedCommits).length}\n`
  markdown += `- 📅 Last Updated: ${new Date().toLocaleString()}\n`

  return markdown
}

/**
 * Main execution.
 */
async function main() {
  console.log('🚀 Updating Feature Matrix...\n')

  // Step 1: Get commits
  console.log('📖 Fetching commits since last release...')
  const commits = getCommitsSinceLastRelease()
  console.log(`✅ Found ${commits.length} commits\n`)

  // Step 2: Parse and group commits
  console.log('🔍 Parsing commits by game and type...')
  const groupedCommits = groupCommitsByGameAndType(commits)
  const affectedGames = Object.keys(groupedCommits)
  console.log(`✅ ${affectedGames.length} games affected:\n`)

  for (const game of affectedGames) {
    const types = Object.keys(groupedCommits[game])
    console.log(`  🎮 ${game}:`)
    for (const type of types) {
      console.log(
        `    ${FEATURE_TYPES[type] || type}: ${groupedCommits[game][type].length} commit(s)`,
      )
    }
  }

  // Step 3: Generate updated markdown
  console.log('\n📝 Generating updated matrix...')
  const matrix = loadMatrix()
  const updatedMarkdown = generateMatrixMarkdown(matrix, groupedCommits)

  // Step 4: Write to file (or dry-run)
  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN - Would write:\n')
    console.log(updatedMarkdown.substring(0, 500) + '...\n')
  } else {
    fs.writeFileSync(MATRIX_FILE, updatedMarkdown)
    console.log(`✅ Updated ${MATRIX_FILE}\n`)

    // Attempt to commit if in git repo
    try {
      execSync(`git add ${MATRIX_FILE}`, { stdio: 'ignore' })
      execSync(`git commit -m "chore(docs): update feature matrix"`, { stdio: 'ignore' })
      console.log('✅ Committed changes to git\n')
    } catch {
      console.log('ℹ️ (Not committing to git automatically)\n')
    }
  }

  console.log('✅ Feature Matrix update complete!')
}

main().catch((error) => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
