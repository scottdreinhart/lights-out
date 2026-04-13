# ⚖️ Gitmoji Governance — Implementation Guide

**Authority**: [Gitmoji Official Spec](https://gitmoji.dev/) + [Conventional Commits](https://www.conventionalcommits.org/)  
**Version**: 1.0.0  
**Date**: April 6, 2026

---

## Quick Start

### Commit Format

```bash
<emoji> <type>(scope): <message>
```

### Examples

```bash
✨ feat(auth): add refresh token rotation
🐛 fix(api): resolve race condition in caching
♻️ refactor(domain): isolate business logic
📝 docs: update API documentation
✅ test(board): add unit tests
🚀 chore(deploy): release v1.2.0
```

### Use the Interactive Prompt

```bash
pnpm commit
# Interactive: select emoji → type → scope → message
# Automation enforces correctness
```

---

## Core Emoji Set (20-25 Recommended)

| Emoji | Type     | Meaning                | Use When                                   |
| ----- | -------- | ---------------------- | ------------------------------------------ |
| ✨    | feat     | New feature            | Adding new functionality                   |
| 🐛    | fix      | Bug fix                | Fixing bugs, issues                        |
| 🚑    | fix      | Critical hotfix        | Production/security fix                    |
| ♻️    | refactor | Refactor               | Reorganizing code without behavior change  |
| ⚡    | perf     | Performance            | Optimizing speed, memory, etc              |
| 🔥    | chore    | Remove code            | Deleting dead/deprecated code              |
| 🎨    | style    | Code format            | Formatting, style cleanup (no behavior)    |
| 🚧    | feat     | Work in progress       | Incomplete features, checkpoints           |
| 📝    | docs     | Documentation          | DOCs, guides, README updates               |
| 📚    | docs     | Knowledge base         | Reference docs, API docs, how-to           |
| ✅    | test     | Add/update tests       | Test additions, coverage, test fixes       |
| 🧪    | test     | Experimental/testing   | Experimental features, test infrastructure |
| 🚨    | ci       | Fix CI warnings        | Lint, type, CI pipeline fixes              |
| 💚    | ci       | Fix CI                 | CI/CD job fixes, workflow issues           |
| ⬆️    | chore    | Upgrade dependency     | Bump package versions                      |
| ➕    | chore    | Add dependency         | Add new packages                           |
| 🔐    | security | Security fix           | CVE patches, auth fixes, XSS fixes         |
| 🌐    | feat     | Internationalization   | i18n/l10n, language support                |
| ♿    | feat     | Accessibility          | WCAG compliance, a11y improvements         |
| 🎉    | chore    | Initial commit/Release | Project init, major releases               |
| 🚀    | chore    | Deployment             | Production deployment                      |

---

## Extended Emoji Set (Optional Extensions)

| Emoji | Type  | Meaning                 | Notes                             |
| ----- | ----- | ----------------------- | --------------------------------- |
| 📦    | build | Package/build artifacts | Build scripts, build config       |
| 🔧    | build | Config/tool changes     | Configuration file changes        |
| 🔨    | build | Dev scripts             | Development scripts               |
| 💄    | style | UI/cosmetic changes     | UI tweaks, styling (non-behavior) |
| 📱    | feat  | Responsive design       | Mobile-first, responsiveness      |
| 💫    | feat  | Animations              | Animation implementation          |
| ✏️    | docs  | Fix typos               | Typo fixes, grammar               |
| 🔄    | chore | Merge/Rebase            | Merge operations, rebases         |
| ⏪    | chore | Revert                  | Undo change, revert commit        |
| 📖    | docs  | Reference docs          | API docs, reference material      |

---

## Normalization Rules

### Rule 1: One Meaning Per Emoji

✅ **Good**: `✨` = feat only  
❌ **Bad**: `✨` = feat AND "cool feature"

### Rule 2: Emoji Matches Type

```
✨ → feat          (always)
🐛 → fix           (always)
♻️ → refactor     (always)
📝 → docs          (always)
```

### Rule 3: No Conflicting Meanings

❌ Don't use `🔥` for:

- Remove code ✅ (standard)
- Cool feature ❌ (conflicts)

### Rule 4: Core Emoji Set is Constrained

- **Recommended core**: 20-25 emojis
- **Optional extensions**: 10+ emojis
- **Disallowed**: Random emojis not in governance spec

### Rule 5: Uppercase Types, Lowercase Messages

```
✨ feat(auth): add token rotation   ✅
✨ Feat(auth): Add Token Rotation   ❌
```

---

## Conventional Commits Integration

Gitmoji builds on Conventional Commits:

```
<emoji> <type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### `type` Mapping

| Type       | Emoji | Meaning             |
| ---------- | ----- | ------------------- |
| `feat`     | ✨    | New feature         |
| `fix`      | 🐛    | Bug fix             |
| `refactor` | ♻️    | Code reorganization |
| `perf`     | ⚡    | Performance         |
| `docs`     | 📝    | Documentation       |
| `test`     | ✅    | Tests               |
| `build`    | 📦    | Build system        |
| `ci`       | 💚    | CI/CD               |
| `chore`    | 🔧    | Maintenance         |
| `style`    | 🎨    | Formatting          |
| `security` | 🔐    | Security            |

---

## Tool Integration

### 1. Commitizen Interactive Prompt

```bash
pnpm commit
```

**Flow**:

1. Select emoji from approved list (gitmoji-governance.json)
2. Select type (feat, fix, etc.)
3. Enter scope (optional)
4. Enter message (lowercase, imperative, no period)
5. Automated validation ensures correctness

**Configuration**: `.czrc.json` uses `emoji-governance.json` as source of truth

### 2. Commitlint Validation

```bash
commitlint --from=main
```

**Validates**:

- ✅ Emoji is in approved set
- ✅ Type matches emoji mapping
- ✅ Message format correct
- ✅ No conflicting meanings
- ✅ Scope format valid (optional)

**Configuration**: `.commitlintrc.cjs` references `emoji-governance.json`

### 3. Husky Git Hooks

**Pre-commit**:

```bash
pnpm lint
pnpm format
pnpm typecheck
```

**Commit-msg**:

```bash
commitlint --edit
# Validates emoji + type + format
```

### 4. CHANGELOG Generation

```bash
pnpm release
# Uses standard-version to generate CHANGELOG.md
# Groups commits by emoji category
```

---

## Changelog Auto-Grouping

Commits are automatically grouped:

```markdown
## [1.2.0] - 2026-04-06

### ✨ Features

- ✨ feat(auth): add refresh token rotation
- 🚧 feat(ui): work in progress on new layout
- 📱 feat(responsive): mobile optimization

### 🐛 Bug Fixes

- 🐛 fix(api): resolve race condition
- 🚑 fix(security): patch XSS vulnerability

### ♻️ Refactoring

- ♻️ refactor(domain): isolate business logic
- 🎨 style: format code

### ⚡ Performance

- ⚡ perf(render): optimize component rendering

### 📝 Documentation

- 📝 docs: update API reference
- ✏️ docs: fix typos

### Testing

- ✅ test(board): add unit tests
- 🧪 test: add integration tests

### CI/CD

- 💚 ci: fix GitHub Actions workflow
- 🚨 ci: fix lint errors

### Dependencies

- ⬆️ chore: upgrade React to 19.2.4
- ➕ chore: add Playwright for e2e tests

### Security

- 🔐 security: patch CVE-2026-12345

### Deployment

- 🚀 chore: release v1.2.0
```

---

## Validation Requirements

### Pre-Commit Checklist

Before running `git commit`:

- [ ] Emoji selected from approved set (20-core or 10-extended)
- [ ] Type matches emoji mapping
- [ ] Scope is optional but if provided: single word, lowercase, hyphenated
- [ ] Message: lowercase, imperative mood ("add", not "added"), no period
- [ ] Message: concise (~50 chars max for subject line)

### Automated Checks (Husky)

```bash
git commit -m "✨ feat(auth): add refresh token rotation"
# Husky runs:
# 1. pnpm fix (auto-fixes lint, format)
# 2. commitlint (validates emoji + type + format)
# 3. Commit created if all pass ✅
```

### CI/CD Validation

All commits to all branches validated:

```bash
commitlint --from=origin/main
# Catches any commits that don't follow spec
# Blocks merge if invalid
```

---

## Enforcement Rules

### ✅ Allowed

- ✨ feat(auth): add login form
- 🐛 fix(ui): correct button alignment
- ♻️ refactor(domain): split rules into modules
- 📝 docs: update README
- ✅ test(board): add unit tests
- 🚀 chore(deploy): release v1.2.0

### ❌ Not Allowed

| Example                    | Problem             | Fix                        |
| -------------------------- | ------------------- | -------------------------- |
| `feat: add login`          | Missing emoji       | `✨ feat: add login`       |
| `✨ Add login`             | Missing type        | `✨ feat: add login`       |
| `✨ feat(Auth): add login` | Scope uppercase     | `✨ feat(auth): add login` |
| `✨ feat: Add login`       | Message uppercase   | `✨ feat: add login`       |
| `✨ feat: add login.`      | Message has period  | `✨ feat: add login`       |
| `💡 feat: add idea`        | Unknown emoji       | Use `✨` instead           |
| `✨ refactor: add code`    | Type/emoji mismatch | Use `♻️ refactor`          |

---

## Troubleshooting

### Problem: "Not a Git repository"

```bash
cd c:\Users\scott\game-platform
git init
```

### Problem: Commitizen not showing emoji prompt

```bash
pnpm install
pnpm exec cz-git --version
# Should show version
# If not: pnpm install cz
```

### Problem: Commitlint says "emoji not found"

```bash
# Check emoji-governance.json is in .github/
# Verify emoji is in core or extended set
# Update .commitlintrc.cjs to reference emoji-governance.json
```

### Problem: "Breaking change" in commit footer

```bash
# If you made a breaking change, manually add:
BREAKING CHANGE: description of what broke
# This will trigger major version bump in release
```

---

## Breaking Changes

If your commit introduces a breaking change, add footer:

```bash
✨ feat(api): redesign board API

This commit changes the Board interface,
removing the deprecated size parameter.

BREAKING CHANGE: Board no longer accepts size parameter.
  OLD: new Board({ size: 9, layout: 'grid' })
  NEW: new Board({ layout: 'grid', dimensions: { width: 3, height: 3 } })
```

**Effect**:

- Commitlint detects BREAKING CHANGE footer
- standard-version bumps major version
- CHANGELOG.md lists under "Breaking Changes"
- Release notes alert maintainers

---

## References

### Official Sources

- [Gitmoji Specification](https://gitmoji.dev/specification)
- [Gitmoji GitHub](https://github.com/carloscuesta/gitmoji)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitizen](http://commitizen.github.io/cz-cli/)

### Extended Reading

- [Git Commit Emojis (Gist)](https://gist.github.com/parmentf/035de27d6ed1dce0b36a)
- [Emoji-Log Alternative](https://opensource.com/article/19/2/emoji-log-git-commit-messages)
- [Testing Library Emoji Commits](https://dev.to/babakks/emojis-for-better-git-commit-messages-52fa)

---

## Files

| File                            | Purpose                                       |
| ------------------------------- | --------------------------------------------- |
| `.github/emoji-governance.json` | Canonical emoji mapping + validation rules    |
| `.commitlintrc.cjs`             | Commitlint config (validates emoji + type)    |
| `.czrc.json`                    | Commitizen cz-git config (interactive prompt) |
| `.husky/commit-msg`             | Git hook that runs commitlint                 |
| `docs/GITMOJI-GOVERNANCE.md`    | This file (usage guide)                       |

---

## Summary

✅ **Machine-parseable**: Conventional Commits type system  
✅ **Visual**: Gitmoji for visual scanning  
✅ **Standardized**: Industry-standard specs (not custom)  
✅ **Validated**: Automated checks enforce rules  
✅ **Documented**: This guide + code comments  
✅ **Scalable**: Works across 40+ apps, 80+ docs, unlimited future commits

**Next step**: Run `pnpm commit` and follow the interactive prompt! 🚀
