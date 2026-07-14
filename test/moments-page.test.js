const assert = require('assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../..');
const htmlPath = path.join(rootDir, 'public/moments/index.html');

execFileSync('npx', ['hexo', 'clean'], { cwd: rootDir, stdio: 'inherit' });
execFileSync('npx', ['hexo', 'generate'], { cwd: rootDir, stdio: 'inherit' });

assert.ok(fs.existsSync(htmlPath), 'moments page should generate public/moments/index.html');

const html = fs.readFileSync(htmlPath, 'utf8');
const newerIndex = html.indexOf('迁移到 Joe3');
const olderIndex = html.indexOf('记录 Hexo');

assert.match(html, /journals\.min\.css/, 'moments page should load journals stylesheet');
assert.match(html, /joe_moments/, 'moments page should render moments layout shell');
assert.notStrictEqual(newerIndex, -1, 'moments page should render newer sample moment');
assert.notStrictEqual(olderIndex, -1, 'moments page should render older sample moment');
assert.ok(newerIndex < olderIndex, 'moments should be sorted by date descending');

console.log('moments-page.test.js PASS');
