const assert = require('assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../..');
const postsDir = path.join(rootDir, 'source/_posts');
const smokePostPath = path.join(postsDir, 'task6-smoke.md');
const relatedPostPath = path.join(postsDir, 'task6-related.md');
const htmlPath = path.join(rootDir, 'public/2026/07/13/task6-smoke/index.html');

fs.mkdirSync(postsDir, { recursive: true });

fs.writeFileSync(smokePostPath, `---
title: Task6 Smoke
date: 2026-07-13
tags: [Java]
---
# H1
## H2 Section
正文内容 enough for TOC.
`);

fs.writeFileSync(relatedPostPath, `---
title: Task6 Related
date: 2026-07-12
tags: [Java]
---
Related content.
`);

try {
  execFileSync('npx', ['hexo', 'clean'], { cwd: rootDir, stdio: 'inherit' });
  execFileSync('npx', ['hexo', 'generate'], { cwd: rootDir, stdio: 'inherit' });

  const html = fs.readFileSync(htmlPath, 'utf8');

  assert.match(html, /joe_post/, 'post page should render post layout shell');
  assert.match(html, /joe_detail/, 'post page should render Joe detail chrome');
  assert.match(html, /joe_detail__title/, 'post page should render title class');
  assert.match(html, /joe_detail__meta/, 'post page should render metadata');
  assert.match(html, /joe_detail__article markdown-body/, 'post page should render content chrome');
  assert.match(html, /toc-container/, 'post page should render TOC aside');
  assert.match(html, /id="js-toc"/, 'post page should render tocbot mount point');
  assert.match(html, /H2 Section/, 'post page should include content heading');
  assert.match(html, /joe_detail__related/, 'post page should render related section');
  assert.match(html, /Task6 Related/, 'post page should include related post link');
  assert.match(html, /tocbot\.min\.js/, 'post page should load tocbot');
  assert.match(html, /toc-init\.js/, 'post page should load toc init script');
  assert.doesNotMatch(html, /id="waline"/, 'Waline comments should stay hidden by default');
} finally {
  fs.rmSync(smokePostPath, { force: true });
  fs.rmSync(relatedPostPath, { force: true });
}

console.log('post-layout.test.js PASS');
