module.exports = [
  {
    name: 'componentName',
    message: 'Component name (PascalCase, e.g., GameBoard):',
    validate: (value) => /^[A-Z][a-zA-Z0-9]*$/.test(value) || 'Must be PascalCase',
  },
  {
    type: 'select',
    name: 'tier',
    message: 'Component tier:',
    choices: ['atom', 'molecule', 'organism'],
    default: 'atom',
  },
  {
    type: 'confirm',
    name: 'withTest',
    message: 'Generate test file?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'withStyles',
    message: 'Generate CSS module?',
    default: true,
  },
]
