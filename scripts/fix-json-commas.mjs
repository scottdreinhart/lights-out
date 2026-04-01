const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '..', 'apps');

function fixPackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Replace missing comma between name and version
    const fixed = content.replace(/"name": "[^"]*"\n\s*"version":/g, (match) => {
      return match.replace('\n', ',\n');
    });
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function processApps() {
  const apps = fs.readdirSync(appsDir);
  apps.forEach(app => {
    const packageJsonPath = path.join(appsDir, app, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      fixPackageJson(packageJsonPath);
    }
  });
}

processApps();