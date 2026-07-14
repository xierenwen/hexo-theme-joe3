const assert = require('assert');
const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../source/css/hexo-side-chars.css');
const layoutPath = path.resolve(__dirname, '../layout/layout.ejs');
const configPath = path.resolve(__dirname, '../_config.yml');

const css = fs.readFileSync(cssPath, 'utf8');
const layout = fs.readFileSync(layoutPath, 'utf8');
const config = fs.readFileSync(configPath, 'utf8');

assert.match(css, /\.joe-side-chars/, 'side-chars css layer');
assert.match(css, /\.joe-side-chars__left/, 'left image class');
assert.match(css, /\.joe-side-chars__right/, 'right image class');
assert.match(css, /max-width:\s*1399px/, 'hidden on narrow viewports');
assert.match(layout, /joe-side-chars/, 'layout mounts side-chars');
assert.match(layout, /sideChars\.left/, 'layout reads left image');
assert.match(layout, /sideChars\.right/, 'layout reads right image');
assert.match(config, /side_chars:/, 'theme config has side_chars');
assert.match(config, /img_intro_pc_L\.png/, 'default left asset path');
assert.match(config, /img_intro_pc_R\.png/, 'default right asset path');

console.log('side-chars.test.js PASS');
