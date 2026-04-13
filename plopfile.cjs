module.exports = (plop) => {
  // Helper to resolve tier path
  const getTierPath = (tier) => {
    const tierMap = {
      atom: 'atoms',
      molecule: 'molecules',
      organism: 'organisms',
    }
    return tierMap[tier] || 'atoms'
  }

  // Component generator
  plop.setGenerator('component', {
    description: 'Generate a React component with optional test and styles',
    prompts: require('./_templates/component/new/prompt.js'),
    actions: (data) => {
      const tierPath = getTierPath(data.tier)
      return [
        // Main component file
        {
          type: 'add',
          path: `apps/lights-out/src/ui/${tierPath}/{{ componentName }}/{{ componentName }}.tsx`,
          templateFile: '_templates/component/new/component.tsx.ejs',
        },
        // Index file
        {
          type: 'add',
          path: `apps/lights-out/src/ui/${tierPath}/{{ componentName }}/index.ts`,
          templateFile: '_templates/component/new/index.ts.ejs',
        },
        // CSS Module (conditional)
        {
          type: 'add',
          path: `apps/lights-out/src/ui/${tierPath}/{{ componentName }}/{{ componentName }}.module.css`,
          templateFile: '_templates/component/new/component.module.css.ejs',
          skip: (data) => !data.withStyles,
        },
        // Test file (conditional)
        {
          type: 'add',
          path: `apps/lights-out/src/ui/${tierPath}/{{ componentName }}/{{ componentName }}.component.test.tsx`,
          templateFile: '_templates/component/new/component.test.tsx.ejs',
          skip: (data) => !data.withTest,
        },
        // Update barrel export
        {
          type: 'modify',
          path: `apps/lights-out/src/ui/${tierPath}/index.ts`,
          pattern: /$/,
          template: "export { {{ componentName }} } from './{{ componentName }}'\n",
        },
      ]
    },
  })

  // Hook generator
  plop.setGenerator('hook', {
    description: 'Generate a custom React hook with optional test',
    prompts: require('./_templates/hook/new/prompt.js'),
    actions: [
      // Main hook file
      {
        type: 'add',
        path: 'apps/lights-out/src/app/hooks/{{ hookName }}.ts',
        templateFile: '_templates/hook/new/hook.ts.ejs',
      },
      // Test file (conditional)
      {
        type: 'add',
        path: 'apps/lights-out/src/app/hooks/{{ hookName }}.test.ts',
        templateFile: '_templates/hook/new/hook.test.ts.ejs',
        skip: (data) => !data.withTest,
      },
      // Update barrel export
      {
        type: 'modify',
        path: 'apps/lights-out/src/app/hooks/index.ts',
        pattern: /$/,
        template: "export { {{ hookName }} } from './{{ hookName }}'\n",
      },
    ],
  })

  // Test generator
  plop.setGenerator('test', {
    description: 'Generate a test file with correct naming convention',
    prompts: require('./_templates/test/new/prompt.js'),
    actions: [
      {
        type: 'add',
        path: 'apps/lights-out/src/{{ targetScope }}/{{ testName }}.{{ testType }}.test.ts',
        templateFile: '_templates/test/new/test.ejs',
      },
    ],
  })

  // Game app generator
  plop.setGenerator('game-app', {
    description: 'Generate a new game app from existing structure',
    prompts: [
      {
        name: 'appName',
        message: 'App name (lowercase with hyphens, e.g., my-game):',
        validate: (value) => /^[a-z][a-z0-9-]*$/.test(value) || 'Must be lowercase with hyphens',
      },
      {
        name: 'displayName',
        message: 'Display name (e.g., My Game):',
      },
      {
        name: 'description',
        message: 'Brief description:',
      },
      {
        type: 'select',
        name: 'template',
        message: 'Use as template:',
        choices: ['lights-out', 'nim', 'sudoku'],
        default: 'lights-out',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'apps/{{ appName }}',
        base: '_templates/game-app/structure',
        templateFiles: '_templates/game-app/structure/**',
      },
    ],
  })
}
