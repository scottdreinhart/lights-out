#!/usr/bin/env node

/**
 * Custom Commitizen Adapter with Gitmoji + Conventional Commits
 * Extends cz-conventional-changelog with gitmoji emoji support
 * 
 * Usage: pnpm commit
 */

module.exports = {
  prompter(cz, commit) {
    // Gitmoji emoji catalog aligned with conventional commit types
    const emojis = {
      feat: {
        emoji: '✨',
        code: ':sparkles:',
        description: 'A new feature'
      },
      fix: {
        emoji: '🐛',
        code: ':bug:',
        description: 'A bug fix'
      },
      docs: {
        emoji: '📚',
        code: ':books:',
        description: 'Documentation only changes'
      },
      style: {
        emoji: '💄',
        code: ':lipstick:',
        description: 'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)'
      },
      refactor: {
        emoji: '♻️',
        code: ':recycle:',
        description: 'A code change that neither fixes a bug nor adds a feature'
      },
      perf: {
        emoji: '⚡',
        code: ':zap:',
        description: 'A code change that improves performance'
      },
      test: {
        emoji: '✅',
        code: ':white_check_mark:',
        description: 'Adding missing tests or correcting existing tests'
      },
      build: {
        emoji: '🔨',
        code: ':hammer:',
        description: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)'
      },
      ci: {
        emoji: '🔄',
        code: ':repeat:',
        description: 'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)'
      },
      chore: {
        emoji: '🧹',
        code: ':broom:',
        description: 'Other changes that don\'t modify src or test files'
      },
      revert: {
        emoji: '⏮️',
        code: ':rewind:',
        description: 'Reverts a previous commit'
      },
      security: {
        emoji: '🔒',
        code: ':lock:',
        description: 'Addresses a security vulnerability'
      },
      deps: {
        emoji: '📦',
        code: ':package:',
        description: 'Update dependencies'
      },
      breaking: {
        emoji: '💥',
        code: ':boom:',
        description: 'A breaking change'
      }
    };

    // Questions
    return cz.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select the type of change that you\'re committing:',
        choices: [
          {
            name: `${emojis.feat.emoji} ${emojis.feat.description}`,
            value: 'feat'
          },
          {
            name: `${emojis.fix.emoji} ${emojis.fix.description}`,
            value: 'fix'
          },
          {
            name: `${emojis.docs.emoji} ${emojis.docs.description}`,
            value: 'docs'
          },
          {
            name: `${emojis.style.emoji} ${emojis.style.description}`,
            value: 'style'
          },
          {
            name: `${emojis.refactor.emoji} ${emojis.refactor.description}`,
            value: 'refactor'
          },
          {
            name: `${emojis.perf.emoji} ${emojis.perf.description}`,
            value: 'perf'
          },
          {
            name: `${emojis.test.emoji} ${emojis.test.description}`,
            value: 'test'
          },
          {
            name: `${emojis.build.emoji} ${emojis.build.description}`,
            value: 'build'
          },
          {
            name: `${emojis.ci.emoji} ${emojis.ci.description}`,
            value: 'ci'
          },
          {
            name: `${emojis.chore.emoji} ${emojis.chore.description}`,
            value: 'chore'
          },
          {
            name: `${emojis.revert.emoji} ${emojis.revert.description}`,
            value: 'revert'
          },
          {
            name: `${emojis.security.emoji} ${emojis.security.description}`,
            value: 'security'
          },
          {
            name: `${emojis.deps.emoji} ${emojis.deps.description}`,
            value: 'deps'
          }
        ]
      },
      {
        type: 'input',
        name: 'scope',
        message: 'What is the scope of this change? (optional):',
        default: ''
      },
      {
        type: 'input',
        name: 'subject',
        message: 'Write a short, imperative tense description of the change:\n',
        default: ''
      },
      {
        type: 'input',
        name: 'body',
        message: 'Provide a longer description of the changes: (press enter to skip)\n',
        default: ''
      },
      {
        type: 'confirm',
        name: 'isBreaking',
        message: 'Are there any breaking changes?',
        default: false
      },
      {
        type: 'input',
        name: 'breaking',
        message: 'Describe the breaking changes:\n',
        default: '',
        when(answers) {
          return answers.isBreaking
        }
      },
      {
        type: 'input',
        name: 'footer',
        message: 'List any issue closures. E.g.: Fixes #123, Resolves #456:\n',
        default: ''
      }
    ]).then((answers) => {
      const emoji = emojis[answers.type]
      let head = `${emoji.emoji} ${answers.type}`

      if (answers.scope) {
        head += `(${answers.scope})`
      }

      head += `: ${answers.subject}`

      let body = answers.body
      if (answers.isBreaking && answers.breaking) {
        body = `BREAKING CHANGE: ${answers.breaking}\n\n${body}`
      }

      let footer = ''
      if (answers.footer) {
        footer = answers.footer
      }

      commit(`${head}\n\n${body}\n\n${footer}`.trim())
    })
  },

  // Message validation
  validateMessage(message) {
    const types = [
      '✨', '🐛', '📚', '💄', '♻️', '⚡', '✅', '🔨',
      '🔄', '🧹', '⏮️', '🔒', '📦', '💥',
      'feat', 'fix', 'docs', 'style', 'refactor', 'perf',
      'test', 'build', 'ci', 'chore', 'revert', 'security', 'deps'
    ]

    const valid =
      message
        .toLowerCase()
        .split('\n')[0]
        .match(new RegExp(`^(${types.join('|')})`)) !== null

    if (!valid) {
      return 'Commit message must start with a valid type emoji or type'
    }

    if (message.length > 100) {
      return 'Commit message is too long (max 100 characters)'
    }

    return true
  }
}
