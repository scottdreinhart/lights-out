/**
 * Commitlint Configuration
 *
 * Authority: AGENTS.md § 31 (Commit Governance)
 * Reference: https://commitlint.js.org/
 *
 * This configuration enforces Conventional Commits format for all commits.
 * Invalid commits are blocked by Husky pre-commit hook.
 *
 * Controlled Format:
 *   <type>(<scope>): <subject>
 *
 *   <body>
 *
 *   <footer>
 *
 * Type Enum: feat, fix, refactor, perf, docs, style, test, build, ci, chore, security, a11y
 * Scope: Optional (domain, app, ui, workers, infra, shared, tests, docs, deps, [game-name])
 * Subject: Lowercase, no period, imperative mood, max 100 chars
 * Body: Optional (wrapped at 72 chars)
 * Footer: BREAKING CHANGE, Closes #123
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type rules (ENFORCED)
    'type-enum': [
      2,
      'always',
      [
        'feat', // ✨ New feature
        'fix', // 🐛 Bug fix
        'refactor', // ♻️ Code reorganization (no logic change)
        'perf', // ⚡ Performance optimization
        'docs', // 📚 Documentation changes
        'style', // 💅 Formatting, linting fixes
        'test', // 🧪 Test additions or fixes
        'build', // 🔨 Build system, dependency updates
        'ci', // 🚀 CI/CD changes
        'chore', // ⚙️ Other maintenance tasks
        'security', // 🔐 Security fixes, CVE patches
        'a11y', // ♿ Accessibility fixes (WCAG)
      ],
    ],
    'type-case': [2, 'always', 'lowercase'], // Type must be lowercase
    'type-empty': [2, 'never'], // Type is REQUIRED

    // Scope rules (OPTIONAL)
    'scope-case': [2, 'always', 'lowercase'], // Scope must be lowercase (if provided)
    'scope-empty': [2, 'always'], // Scope is optional

    // Subject rules (ENFORCED)
    'subject-case': [2, 'always', 'lowercase'], // Subject must start lowercase
    'subject-full-stop': [2, 'never', '.'], // No period at end
    'subject-empty': [2, 'never'], // Subject is REQUIRED
    'subject-max-length': [2, 'always', 100], // Max 100 characters
    'subject-min-length': [2, 'always', 3], // Min 3 characters

    // Body rules (OPTIONAL)
    'body-leading-blank': [2, 'always'], // Blank line before body
    'body-max-line-length': [2, 'always', 72], // Wrapped at 72 chars

    // Footer rules (OPTIONAL)
    'footer-leading-blank': [2, 'always'], // Blank line before footer
    'footer-max-line-length': [2, 'always', 72], // Wrapped at 72 chars
  },

  // Helpful rules for CI
  'header-max-length': [2, 'always', 100],
  'header-min-length': [2, 'always', 10],
}

/**
 * How This Is Used:
 *
 * 1. Developer runs: pnpm commit
 *    → Commitizen prompts for type, scope, subject, body, changes
 *
 * 2. On commit, Husky runs: .husky/commit-msg
 *    → Executes: npx commitlint --edit $1
 *    → This configuration validates the message
 *
 * 3. If validation fails:
 *    → Error printed to console
 *    → Commit rejected
 *    → Developer must fix and retry
 *
 * 4. If validation passes:
 *    → Commit allowed
 *    → CI re-validates on push
 *
 * Testing:
 *
 *   # Test this configuration manually:
 *   echo "feat(domain): add hint system" | npx commitlint
 *
 *   # Should output:
 *   ⧖ input: feat(domain): add hint system
 *   ✔ found 0 problems, 0 warnings
 *
 *   echo "add hint system" | npx commitlint
 *
 *   # Should output:
 *   ⧖ input: add hint system
 *   ✖ type: missing (rule: type-enum)
 *
 * Reference: docs/COMMIT-ENFORCEMENT.md, AGENTS.md § 31
 */
