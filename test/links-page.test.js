const assert = require('assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../..');
const htmlPath = path.join(rootDir, 'public/links/index.html');

execFileSync('npx', ['hexo', 'clean'], { cwd: rootDir, stdio: 'inherit' });
execFileSync('npx', ['hexo', 'generate'], { cwd: rootDir, stdio: 'inherit' });

assert.ok(fs.existsSync(htmlPath), 'links page should generate public/links/index.html');

const html = fs.readFileSync(htmlPath, 'utf8');

assert.match(html, /friends\.min\.css/, 'links page should load friends stylesheet');
assert.match(html, /joe_friends/, 'links page should render friends layout shell');
assert.match(html, /Joe3/, 'links page should render sample Joe3 link');
assert.match(html, /Hexo/, 'links page should render sample Hexo link');

console.log('links-page.test.js PASS');
