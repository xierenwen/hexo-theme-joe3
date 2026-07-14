const assert = require('assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../..');
const postsDir = path.join(rootDir, 'source/_posts');
const smokePostPath = path.join(postsDir, 'plugins-smoke.md');
const htmlPath = path.join(rootDir, 'public/2026/07/13/plugins-smoke/index.html');
const indexPath = path.join(rootDir, 'public/index.html');
const themeConfig = fs.readFileSync(path.join(rootDir, 'themes/joe3/_config.yml'), 'utf8');
const musicEnabled = /music:\s*[\s\S]*?enable:\s*true/.test(themeConfig);

fs.mkdirSync(postsDir, { recursive: true });

fs.writeFileSync(smokePostPath, `---
title: Plugins Smoke
date: 2026-07-13 12:00:00
tags: [Java]
---
\`\`\`java
public class Hello {
  public static void main(String[] args) {}
}
\`\`\`
`);

try {
  execFileSync('npx', ['hexo', 'clean'], { cwd: rootDir, stdio: 'inherit' });
  execFileSync('npx', ['hexo', 'generate'], { cwd: rootDir, stdio: 'inherit' });

  const postHtml = fs.readFileSync(htmlPath, 'utf8');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  assert.match(postHtml, /enable_code_copy:\s*true/, 'ThemeConfig should enable code copy');
  assert.match(postHtml, /enable_code_title:\s*true/, 'ThemeConfig should enable code title');
  assert.match(postHtml, /enable_code_macdot:\s*true/, 'ThemeConfig should enable mac dots');
  assert.match(postHtml, /clipboard\.min\.js/, 'post should load clipboard');
  assert.match(postHtml, /qmsg\.js/, 'post should load qmsg');
  assert.match(postHtml, /figure class="highlight java"/, 'post should contain highlight block');
  assert.match(postHtml, /hexo-highlight\.css/, 'post should load highlight chrome css');

  assert.match(indexHtml, /id="joe-hitokoto"/, 'homepage aside should render hitokoto card');
  assert.match(indexHtml, /enable_hitokoto:\s*true/, 'ThemeConfig should enable hitokoto');
  assert.match(indexHtml, /hexo-widgets\.css/, 'hitokoto should load widgets css');

  if (musicEnabled) {
    assert.match(indexHtml, /enable_global_music_player:\s*true/, 'music ThemeConfig should be on');
    assert.match(indexHtml, /APlayer\.min\.js/, 'APlayer js should load when music enabled');
    assert.match(indexHtml, /id="global-aplayer"/, 'global aplayer mount should exist');
    assert.match(indexHtml, /<\/div>\s*<div id="global-aplayer">/, 'aplayer should sit outside #Joe');
    assert.match(indexHtml, /enable_pjax:\s*true/, 'pjax should auto-enable with music');
    assert.match(indexHtml, /jquery\.pjax\.min\.js/, 'pjax lib should load');
    assert.match(indexHtml, /\/js\/pjax\.js/, 'pjax init should load');
  } else {
    assert.match(indexHtml, /enable_global_music_player:\s*false/, 'music should stay disabled by default');
    assert.doesNotMatch(indexHtml, /APlayer\.min\.js/, 'APlayer js should not load when music disabled');
    assert.doesNotMatch(indexHtml, /id="global-aplayer"/, 'global aplayer mount should be absent by default');
  }
} finally {
  fs.rmSync(smokePostPath, { force: true });
}

console.log('plugins-config.test.js PASS');
