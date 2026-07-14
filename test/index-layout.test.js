const assert = require('assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../..');
const indexPath = path.join(rootDir, 'public/index.html');

execFileSync('npx', ['hexo', 'clean'], { cwd: rootDir, stdio: 'inherit' });
execFileSync('npx', ['hexo', 'generate'], { cwd: rootDir, stdio: 'inherit' });

const html = fs.readFileSync(indexPath, 'utf8');

assert.match(html, /joe_list/, 'index should render post list structure');
assert.match(html, /joe_aside/, 'index should render aside structure when enabled');
assert.match(html, /paginator|pagination/, 'index should render pagination structure');

console.log('index-layout.test.js PASS');
