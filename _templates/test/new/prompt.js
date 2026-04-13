module.exports = [
  {
    name: 'testName',
    message: 'Test file name without extension (e.g., gameBoard.component):',
    validate: (value) =>
      /^[a-z][a-zA-Z0-9]*(\.(unit|integration|component|api|e2e|a11y|visual|perf))?$/.test(value) ||
      'Invalid name format',
  },
  {
    type: 'select',
    name: 'testType',
    message: 'Test type:',
    choices: ['unit', 'integration', 'component', 'api', 'e2e', 'a11y', 'visual', 'perf'],
    default: 'unit',
  },
]
