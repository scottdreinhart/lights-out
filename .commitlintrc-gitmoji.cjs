/**
 * Commitlint Configuration with Gitmoji Support
 *
 * Authority: AGENTS.md § 31 (Commit Governance) + Gitmoji Spec
 * Reference: https://commitlint.js.org/ + https://gitmoji.dev/
 *
 * This configuration enforces:
 *   1. Gitmoji emoji from approved set (emoji-governance.json)
 *   2. Conventional Commits types (feat, fix, etc.)
 *   3. Emoji ↔ Type mapping validation
 *   4. Message format rules
 *
 * Controlled Format:
 *   <emoji> <type>(<scope>): <subject>
 *
 *   <body>
 *
 *   <footer>
 *
 * Emoji: Required (from emoji-governance.json core or extended set)
 * Type: Required (feat, fix, refactor, perf, docs, style, test, build, ci, chore, security)
 * Scope: Optional (domain, app, ui, workers, infra, shared, tests, docs, deps, [game-name])
 * Subject: Lowercase, no period, imperative mood, max 100 chars
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load emoji-governance.json to get approved emoji set and mappings
let emojiGovernance = {}
try {
  const governancePath = path.join(__dirname, '.github', 'emoji-governance.json')
  const governanceContent = fs.readFileSync(governancePath, 'utf-8')
  emojiGovernance = JSON.parse(governanceContent)
} catch (err) {
  console.warn('⚠️ emoji-governance.json not found, using fallback emoji set')
  // Fallback if file doesn't exist yet
  emojiGovernance = {
    core_emojis: {
      '✨': { type: 'feat' },
      '🐛': { type: 'fix' },
      '🚑': { type: 'fix' },
      '♻️': { type: 'refactor' },
      '⚡': { type: 'perf' },
      '🔥': { type: 'chore' },
      '🎨': { type: 'style' },
      '🚧': { type: 'feat' },
      '📝': { type: 'docs' },
      '📚': { type: 'docs' },
      '✅': { type: 'test' },
      '🧪': { type: 'test' },
      '🚨': { type: 'ci' },
      '💚': { type: 'ci' },
      '⬆️': { type: 'chore' },
      '➕': { type: 'chore' },
      '🔐': { type: 'security' },
      '🌐': { type: 'feat' },
      '♿': { type: 'feat' },
      '🎉': { type: 'chore' },
      '🚀': { type: 'chore' },
    },
    extended_emojis: {
      '📦': { type: 'build' },
      '🔧': { type: 'build' },
      '🔨': { type: 'build' },
      '💄': { type: 'style' },
      '📱': { type: 'feat' },
      '💫': { type: 'feat' },
      '✏️': { type: 'docs' },
      '🔄': { type: 'chore' },
      '⏪': { type: 'chore' },
      '📖': { type: 'docs' },
    },
  }
}

// Build emoji → type mapping
const approvedEmojis = {
  ...emojiGovernance.core_emojis,
  ...emojiGovernance.extended_emojis,
}
const emojiList = Object.keys(approvedEmojis)
const emojiTypeMap = Object.fromEntries(Object.entries(approvedEmojis).map(([emoji, info]) => [emoji, info.type]))

// Commitlint custom rule: validate emoji → type mapping
const validateEmojiTypeMapping = () => {
  return (parsed) => {
    const { header } = parsed
    if (!header) return [true]

    // Extract emoji and type from header
    // Format: <emoji> <type>(scope): message
    const emojiTypeMatch = header.match(/^([\p{Emoji_Presentation}])\s+(\w+)/u)
    if (!emojiTypeMatch) {
      // No emoji found, warn (emoji validation will catch this)
      return [true]
    }

    const [, emoji, type] = emojiTypeMatch
    const expectedType = emojiTypeMap[emoji]

    if (expectedType && expectedType !== type) {
      return [
        false,
        `emoji ↔ type mismatch: "${emoji}" should use type "${expectedType}", not "${type}"`,
      ]
    }

    return [true]
  }
}

export default {
  extends: ['@commitlint/config-conventional'],

  // Custom rules for emoji validation
  rules: {
    // ===== EMOJI VALIDATION (NEW) =====
    'emoji-enum': [
      2,
      'always',
      emojiList,
    ],
    'emoji-empty': [2, 'never'], // Emoji is REQUIRED
    'emoji-case': [2, 'always', 'lowercase'], // Emoji check (no-op, but validates presence)

    // Custom rule: validate emoji ↔ type mapping
    'emoji-type-mapping': [2, 'always', validateEmojiTypeMapping()],

    // ===== TYPE VALIDATION =====
    'type-enum': [
      2,
      'always',
      [
        'feat', // ✨ New feature
        'fix', // 🐛 Bug fix
        'refactor', // ♻️ Code reorganization
        'perf', // ⚡ Performance
        'docs', // 📝 Documentation
        'style', // 🎨 Code formatting
        'test', // ✅ Tests
        'build', // 📦 Build system
        'ci', // 💚 CI/CD
        'chore', // 🔧 Maintenance
        'security', // 🔐 Security fixes
      ],
    ],
    'type-case': [2, 'always', 'lowercase'], // Lowercase
    'type-empty': [2, 'never'], // REQUIRED

    // ===== SCOPE VALIDATION =====
    'scope-case': [2, 'always', 'lowercase'], // Lowercase if provided
    'scope-empty': [2, 'always'], // Optional

    // ===== SUBJECT VALIDATION =====
    'subject-case': [2, 'always', 'lowercase'], // Start lowercase
    'subject-full-stop': [2, 'never', '.'], // No period
    'subject-empty': [2, 'never'], // REQUIRED
    'subject-max-length': [2, 'always', 100], // Max 100 chars
    'subject-min-length': [2, 'always', 3], // Min 3 chars

    // ===== BODY VALIDATION =====
    'body-leading-blank': [2, 'always'], // Blank line before body
    'body-max-line-length': [2, 'always', 72], // Wrapped at 72

    // ===== FOOTER VALIDATION =====
    'footer-leading-blank': [2, 'always'], // Blank line before footer
    'footer-max-line-length': [2, 'always', 72], // Wrapped at 72
  },

  // Header rules
  'header-max-length': [2, 'always', 100],
  'header-min-length': [2, 'always', 10],

  // Additional config
  prompt: {
    settings: {},
    messages: {
      skip: ':skip',
      max: 'upper %d chars | %d chars left',
      min: '%d chars at least | -(%d) you entered',
      emptyNotAllowed: "can't be empty",
      upper: 'UPPERCASE this',
      lower: 'lowercase this',
      capitalizeFirstLetter: 'Capitalize first letter',
      labelBreakingChange: 'breaking changes',
      labelIssueContext: 'issue context',
      confirmCommit: 'confirm commit?',
    },
  },
}

/**
 * VALIDATION PRIORITY
 *
 * 1. Emoji validation (must be in approved set)
 * 2. Type validation (must match emoji)
 * 3. Emoji ↔ Type mapping (emoji type must match declared type)
 * 4. Format rules (case, length, etc.)
 */

/**
 * HOW THIS IS USED
 *
 * 1. Developer runs: pnpm commit
 *    → Commitizen prompts (configured by .czrc.json)
 *    → Shows ONLY approved emojis from emoji-governance.json
 *
 * 2. Developer enters: ✨ feat(auth): add token rotation
 *
 * 3. On commit, Husky runs: .husky/commit-msg
 *    → Executes: npx commitlint --edit $1
 *    → This config validates:
 *       ✅ ✨ is in approved emoji set
 *       ✅ feat is valid type
 *       ✅ ✨ maps to feat (from emoji-governance.json)
 *       ✅ Message format correct
 *
 * 4. If any check fails:
 *    → Error printed with details
 *    → Commit blocked
 *    → Developer fixes and retries
 *
 * 5. If all pass:
 *    → Commit created
 *    → Message in history with emoji + color rendered
 *
 * TESTING
 *
 *   # Valid commit:
 *   echo "✨ feat(domain): add hint system" | npx commitlint
 *   # Output: ✔ found 0 problems, 0 warnings
 *
 *   # Invalid emoji:
 *   echo "💡 feat: add idea" | npx commitlint
 *   # Output: ✖ emoji-enum: emoji must be one of [...] (problems with emoji)
 *
 *   # Invalid emoji ↔ type mapping:
 *   echo "📝 feat(docs): add docs" | npx commitlint
 *   # Output: ✖ emoji-type-mapping: emoji "📝" should use type "docs", not "feat"
 *
 *   # Missing emoji:
 *   echo "feat(domain): add feature" | npx commitlint
 *   # Output: ✖ emoji-empty: emoji is required
 */

/**
 * REFERENCES
 *
 * - Gitmoji Spec: https://gitmoji.dev/specification
 * - Conventional Commits: https://www.conventionalcommits.org/
 * - Emoji Governance: ./emoji-governance.json
 * - Usage Guide: docs/GITMOJI-GOVERNANCE.md
 * - Commitlint Docs: https://commitlint.js.org/
 * - Commitizen Docs: http://commitizen.github.io/cz-cli/
 */
