const tsConfigPaths = require('tsconfig-paths');

// Load tsconfig.json from the current directory
const baseUrl = __dirname;

// Register the paths to point to the compiled dist/ directory
tsConfigPaths.register({
  baseUrl: baseUrl,
  paths: {
    'src/*': ['./dist/*'], // Map src/* to dist/* (compiled code)
  },
  addMatchAll: false,
});

console.log('✓ tsconfig-paths registered');
console.log('✓ Mapping src/* → ./dist/*');
