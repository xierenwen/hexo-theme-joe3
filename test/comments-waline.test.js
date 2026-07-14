const assert = require('assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../..');
const postsDir = path.join(rootDir, 'source/_posts');
const smokePostPath = path.join(postsDir, 'task9-waline.md');
const htmlPath = path.join(rootDir, 'public/2026/07/13/task9-waline/index.html');
const themeConfigPath = path.join(rootDir, 'themes/joe3/_config.yml');
const originalThemeConfig = fs.readFileSync(themeConfigPath, 'utf8');

fs.mkdirSync(postsDir, { recursive: true });

const walineThemeConfig = originalThemeConfig
  .replace('comments:\n  enable: false', 'comments:\n  enable: true')
  .replace('    serverURL: ""', '    serverURL: "https://waline.example.com"');

fs.writeFileSync(themeConfigPath, walineThemeConfig);
fs.writeFileSync(smokePostPath, `---
title: Task9 Waline
date: 2026-07-13
---
Waline smoke content.
`);

try {
  execFileSync('npx', ['hexo', 'clean'], { cwd: rootDir, stdio: 'inherit' });
  execFileSync('npx', ['hexo', 'generate'], { cwd: rootDir, stdio: 'inherit' });

  const html = fs.readFileSync(htmlPath, 'utf8');

  assert.match(html, /@waline\/client@v3\/dist\/waline\.css/, 'post should load Waline v3 css');
  assert.match(html, /<section id="waline" class="joe_comment"><\/section>/, 'post should mount Waline container');
  assert.match(html, /<script type="module">/, 'post should initialize Waline from a module script');
  assert.match(html, /@waline\/client@v3\/dist\/waline\.js/, 'post should import Waline v3 module');
  assert.match(html, /serverURL:\s*['"]https:\/\/waline\.example\.com['"]/, 'post should pass Waline serverURL');
  assert.match(html, /dark:\s*['"]html\[data-mode="dark"\]['"]/, 'post should pass dark selector');
  assert.match(html, /path:\s*['"]\/2026\/07\/13\/task9-waline\/['"]/, 'post should pass page path');
} finally {
  fs.writeFileSync(themeConfigPath, originalThemeConfig);
  fs.rmSync(smokePostPath, { force: true });
}

console.log('comments-waline.test.js PASS');
