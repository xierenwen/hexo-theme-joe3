const assert = require('assert');
const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../source/css/hexo-fonts.css');
const headPath = path.resolve(__dirname, '../layout/_partial/head.ejs');
const scriptsPath = path.resolve(__dirname, '../layout/_partial/scripts.ejs');
const configPath = path.resolve(__dirname, '../_config.yml');
const fontsDir = path.resolve(__dirname, '../source/fonts');

const css = fs.readFileSync(cssPath, 'utf8');
const head = fs.readFileSync(headPath, 'utf8');
const scripts = fs.readFileSync(scriptsPath, 'utf8');
const config = fs.readFileSync(configPath, 'utf8');

assert.match(css, /@font-face/, 'local @font-face');
assert.match(css, /hina-mincho-japanese-400-normal\.woff2/, 'local hina japanese');
assert.match(css, /zen-kurenaido-japanese-400-normal\.woff2/, 'local zen japanese');
assert.match(css, /Songti SC/, 'system CJK fallback');
assert.doesNotMatch(css, /fonts\.googleapis|Noto Serif SC/, 'no google/noto serif sc');
assert.match(head, /hexo-fonts\.css/, 'fonts css in head');
assert.match(head, /hina-mincho-japanese-400-normal\.woff2/, 'preload main font');
assert.doesNotMatch(head, /fonts\.googleapis/, 'no google fonts in head');
assert.doesNotMatch(scripts, /fonts-lazy\.js/, 'cdn lazy loader removed');
assert.match(config, /fonts:\s*\n\s*enable:\s*true/, 'fonts enabled');

const required = [
  'hina-mincho-latin-400-normal.woff2',
  'hina-mincho-latin-ext-400-normal.woff2',
  'hina-mincho-japanese-400-normal.woff2',
  'zen-kurenaido-latin-400-normal.woff2',
  'zen-kurenaido-japanese-400-normal.woff2'
];
required.forEach((name) => {
  assert.ok(fs.existsSync(path.join(fontsDir, name)), 'missing font ' + name);
});

console.log('fonts.test.js PASS');
