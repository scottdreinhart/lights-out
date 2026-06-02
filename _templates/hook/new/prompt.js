module.exports = [
  {
    name: 'hookName',
    message: 'Hook name (camelCase, e.g., useGameLogic):',
    validate: (value) =>
      /^use[A-Z][a-zA-Z0-9]*$/.test(value) || 'Must start with "use" and be camelCase',
  },
  {
    type: 'select',
    name: 'type',
    message: 'Hook type:',
    choices: ['state', 'effect', 'callback', 'context', 'custom'],
    default: 'state',
  },
  {
    type: 'confirm',
    name: 'withTest',
    message: 'Generate test file?',
    default: true,
  },
]
