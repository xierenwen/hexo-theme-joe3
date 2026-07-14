const assert = require('assert');
const fs = require('fs');
const path = require('path');
const https = require('https');

const commonSource = fs.readFileSync(
  path.resolve(__dirname, '../source/js/common.js'),
  'utf8'
);
const configSource = fs.readFileSync(
  path.resolve(__dirname, '../_config.yml'),
  'utf8'
);
const scriptsSource = fs.readFileSync(
  path.resolve(__dirname, '../layout/_partial/scripts.ejs'),
  'utf8'
);
const apiSource = fs.readFileSync(
  path.resolve(__dirname, '../../../api/meting.js'),
  'utf8'
);

assert.match(commonSource, /credentials:\s*["']same-origin["']/, 'initMusic should fetch same-origin proxy');
assert.match(commonSource, /\/api\/meting/, 'initMusic should prefer /api/meting');
assert.match(commonSource, /item\.name\s*\|\|\s*item\.title/, 'initMusic should normalize title→name');
assert.match(commonSource, /item\.cover\s*\|\|\s*item\.pic/, 'initMusic should normalize pic→cover');
assert.match(commonSource, /filter\(\(item\)\s*=>\s*!!item\.url\)/, 'initMusic should drop tracks without url');
assert.match(scriptsSource, /\/api\/meting/, 'scripts default music api should be same-origin proxy');
assert.match(configSource, /api:\s*\/api\/meting/, 'theme config should use same-origin proxy');
assert.match(apiSource, /api\.injahow\.cn\/meting/, 'vercel proxy should point to upstream meting');

const apiUrl =
  'https://api.injahow.cn/meting/?server=netease&type=playlist&id=2830604597';

https
  .get(apiUrl, { headers: { 'User-Agent': 'joe3-test' }, timeout: 10000 }, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      assert.strictEqual(res.statusCode, 200, 'meting api should respond 200');
      const data = JSON.parse(body);
      assert.ok(Array.isArray(data) && data.length > 0, 'playlist should be non-empty');
      assert.ok(data[0].url || data[0].name, 'playlist item should look like audio meta');
      console.log('music-init.test.js PASS');
    });
  })
  .on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
